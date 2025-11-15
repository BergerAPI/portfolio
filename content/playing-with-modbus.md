---
title: 'Playing with modbus'
date: '2025-11-05'
---

When a friend asked me to help extract data from their solar inverter
(Wechselrichter), I thought it would be straightforward. The German manufacturer
had locked down their system tighter than a vault, exposing minimal information
through their proprietary software. After some digging, I discovered Modbus was
available but completely undocumented. What followed was a journey into the
world of industrial communication protocols, reverse engineering, and the art of
making uncooperative hardware talk.

# What is Modbus?

Modbus is an industrial communication protocol developed in 1979 that has become
a de facto standard for connecting industrial devices. It's simple, robust, and
widely supported - which is probably why it's still everywhere today, even in
modern solar inverters.

The protocol works on a master-slave model where:

- **Master** (your computer) sends requests
- **Slave** (the inverter) responds with data
- Communication happens over serial (RTU) or TCP/IP networks
- Data is organized in registers that hold different values

# Prerequisites

Before diving into Modbus communication, you'll need these tools. I'm focusing
on Linux/Unix tools, but Windows equivalents exist.

1. **Modbus CLI Tools**
   ```bash
   sudo apt-get install libmodbus-dev
   # Or install modbus-utils for basic CLI tools
   pip install pymodbus[cli]
   ```

2. **Python and PyModbus** (for scripting)
   ```bash
   pip install pymodbus
   ```

3. **Network scanning tools** (for TCP Modbus)
   ```bash
   sudo apt-get install nmap
   ```

4. **Serial tools** (for RTU Modbus)
   ```bash
   sudo apt-get install minicom screen
   ```

5. **Optional: Wireshark** (for protocol analysis)
   ```bash
   sudo apt-get install wireshark
   ```

# Key Concepts

## Modbus Data Model

Modbus organizes data into four types of registers:

| **Type**               | **Access** | **Size** | **Purpose**                        |
| ---------------------- | ---------- | -------- | ---------------------------------- |
| Coils (0x)             | Read/Write | 1 bit    | Digital outputs (relays, switches) |
| Discrete Inputs (1x)   | Read-only  | 1 bit    | Digital inputs (sensors, switches) |
| Input Registers (3x)   | Read-only  | 16 bit   | Analog inputs (measurements)       |
| Holding Registers (4x) | Read/Write | 16 bit   | Configuration, setpoints           |

## Function Codes

Modbus uses function codes to specify operations:

- `0x01` - Read Coils
- `0x02` - Read Discrete Inputs
- `0x03` - Read Holding Registers
- `0x04` - Read Input Registers
- `0x05` - Write Single Coil
- `0x06` - Write Single Register

## Register Addressing

This is where it gets tricky. Modbus has different addressing conventions:

- **Protocol addresses**: 0-based (0, 1, 2, ...)
- **Data model addresses**: 1-based (1, 2, 3, ...)
- **Register references**: Type prefix + address (30001, 40001, ...)

Most tools use protocol addresses (0-based), but documentation often uses data
model addresses.

# The Investigation Process

## Step 1: Network Discovery

First, I needed to find the inverter on the network. Most modern inverters
support Modbus TCP on port 502.

```bash
# Scan for devices with open Modbus port
nmap -p 502 192.168.1.0/24

# Check if specific IP responds
nmap -p 502 192.168.1.100
```

## Step 2: Initial Connection Test

Once I found the IP, I tested basic connectivity:

```bash
# Test connection using modbus CLI
modbus read 192.168.1.100 502 1 0 10

# Or using Python for a quick test
python3 -c "
from pymodbus.client import ModbusTcpClient
client = ModbusTcpClient('192.168.1.100')
result = client.read_holding_registers(0, 10, slave=1)
print(result.registers if not result.isError() else 'Error')
client.close()
"
```

## Step 3: Register Discovery

This was the real detective work. With no documentation, I had to map out what
each register contained by reading ranges and correlating with the inverter's
display.

```bash
# Read ranges of registers to find data
for i in {0..100..10}; do
    echo "Registers $i-$((i+9)):"
    modbus read 192.168.1.100 502 1 $i 10
    sleep 1
done
```

## Step 4: Data Interpretation

The raw register values needed interpretation. Solar inverters typically store:

- **Power values**: Often in watts or kilowatts
- **Voltage/Current**: Usually with scaling factors
- **Energy counters**: Accumulated values
- **Status codes**: Bit flags or enumerated values

I created a mapping table by observing the inverter display and correlating with
register values:

```python
# Example register mapping discovered through testing
REGISTER_MAP = {
    40001: {"name": "AC_Power", "unit": "W", "scale": 1},
    40002: {"name": "AC_Voltage_L1", "unit": "V", "scale": 0.1},
    40003: {"name": "AC_Current_L1", "unit": "A", "scale": 0.01},
    40010: {"name": "DC_Voltage", "unit": "V", "scale": 0.1},
    40011: {"name": "DC_Current", "unit": "A", "scale": 0.01},
    40020: {"name": "Total_Energy", "unit": "kWh", "scale": 0.1},
}
```

# The Python Solution

After mapping the registers, I created a Python script to read and interpret the
data:

```python
#!/usr/bin/env python3
from pymodbus.client import ModbusTcpClient
import time
import json
from datetime import datetime

class InverterReader:
    def __init__(self, host, port=502, slave_id=1):
        self.client = ModbusTcpClient(host, port=port)
        self.slave_id = slave_id
        
        # Register mapping discovered through investigation
        self.registers = {
            0: {"name": "AC_Power", "unit": "W", "scale": 1},
            1: {"name": "AC_Voltage_L1", "unit": "V", "scale": 0.1},
            2: {"name": "AC_Current_L1", "unit": "A", "scale": 0.01},
            9: {"name": "DC_Voltage", "unit": "V", "scale": 0.1},
            10: {"name": "DC_Current", "unit": "A", "scale": 0.01},
            19: {"name": "Total_Energy", "unit": "kWh", "scale": 0.1},
            30: {"name": "Inverter_Temperature", "unit": "°C", "scale": 0.1},
        }
    
    def connect(self):
        """Establish connection to the inverter"""
        return self.client.connect()
    
    def read_register(self, address):
        """Read a single holding register"""
        try:
            result = self.client.read_holding_registers(address, 1, slave=self.slave_id)
            if result.isError():
                return None
            return result.registers[0]
        except Exception as e:
            print(f"Error reading register {address}: {e}")
            return None
    
    def read_all_data(self):
        """Read all mapped registers and return formatted data"""
        data = {
            "timestamp": datetime.now().isoformat(),
            "readings": {}
        }
        
        for address, config in self.registers.items():
            raw_value = self.read_register(address)
            if raw_value is not None:
                # Apply scaling factor
                scaled_value = raw_value * config["scale"]
                data["readings"][config["name"]] = {
                    "value": scaled_value,
                    "unit": config["unit"],
                    "raw": raw_value
                }
        
        return data
    
    def monitor(self, interval=30):
        """Continuously monitor and log data"""
        print("Starting inverter monitoring...")
        
        while True:
            try:
                data = self.read_all_data()
                
                # Print current readings
                print(f"\n--- {data['timestamp']} ---")
                for name, reading in data["readings"].items():
                    print(f"{name}: {reading['value']} {reading['unit']}")
                
                # Optionally save to file
                with open("inverter_data.json", "a") as f:
                    f.write(json.dumps(data) + "\n")
                
                time.sleep(interval)
                
            except KeyboardInterrupt:
                print("\nMonitoring stopped by user")
                break
            except Exception as e:
                print(f"Error during monitoring: {e}")
                time.sleep(5)  # Wait before retrying
    
    def close(self):
        """Close the connection"""
        self.client.close()

# Usage example
if __name__ == "__main__":
    inverter = InverterReader("192.168.1.100")
    
    if inverter.connect():
        print("Connected to inverter successfully!")
        
        # Read current data
        current_data = inverter.read_all_data()
        print(json.dumps(current_data, indent=2))
        
        # Start monitoring (uncomment to run)
        # inverter.monitor(interval=60)
        
    else:
        print("Failed to connect to inverter")
    
    inverter.close()
```

# Lessons Learned

## 1. Register Discovery is Detective Work

Without documentation, finding the right registers requires patience and
systematic testing. I found it helpful to:

- Compare register values with the inverter's display
- Test during different conditions (day/night, load changes)
- Look for patterns in consecutive registers
- Check for common Modbus conventions used by other manufacturers

## 2. Data Scaling Matters

Raw register values often need scaling. A register showing `2350` might actually
represent `235.0V` or `23.50A`. The scaling factor is usually a power of 10
(0.1, 0.01, etc.).

## 3. Error Handling is Critical

Industrial networks can be noisy. Always implement:

- Connection retry logic
- Register read timeouts
- Data validation (sanity checks)
- Graceful degradation when some registers fail

## 4. Documentation Everything

Keep detailed notes of your discoveries. Create a register map with:

- Register addresses
- Data types and scaling
- Valid ranges
- Update frequencies
- Any quirks or special behavior

# Beyond the Basics

Once you have basic communication working, you can extend the system:

- **Database logging**: Store historical data in InfluxDB or SQLite
- **Web dashboard**: Create a real-time monitoring interface
- **Alerts**: Notify when values exceed thresholds
- **Integration**: Connect with home automation systems
- **Analysis**: Generate reports on energy production and efficiency

The key is starting simple and building up complexity as needed.

# Conclusion

Working with undocumented Modbus devices taught me that persistence pays off.
What started as a favor for a friend became a deep dive into industrial
protocols and reverse engineering. The combination of CLI tools for discovery
and Python for automation proved powerful for taming an uncooperative German
inverter.

The beauty of Modbus is its simplicity. Once you understand the basics, you can
communicate with thousands of industrial devices. The challenge is often not the
protocol itself, but discovering what each device actually exposes through its
registers.

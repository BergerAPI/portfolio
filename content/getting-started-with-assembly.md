---
title: 'Getting Started with Assembly'
date: '2023-08-17'
---

A while ago I got curious and started to wonder how computers actually work. The
answer was assembly. Instead of reading a 500-page assembly manual, I created a
small collection of simple programs of which each taught me a different concept.
This collection became [BergerAPI/asm](https://github.com/BergerAPI/asm), and
this post introduces you to assembly.

# Prerequisites

Before you start writing assembly, you must have (some of) these tools
installed. This post focuses on using NASM (Netwide Assembler) in an x86-64
Linux environment.

1. **NASM (Netwide Assembler)**
   ```bash
   sudo apt-get install nasm
   ```

2. **GNU Binutils** (Includes the linker `ld` and `objdump`)
   ```bash
   sudo apt-get install binutils
   ```

3. **GNU Make** (already on most Linux systems)
   ```bash
   sudo apt-get install build-essential
   ```

4. **GDB** (optional but highly recommended)
   ```bash
   sudo apt-get install gdb
   ```

5. **gcc** (optional, for mixing assembly with C later)
   ```bash
   sudo apt-get install gcc
   ```

# Key Concepts

## Program Structure

The code is structured using sections:

- `section .data` for initialized global and static data (like
  `char *msg = "hello";`)
- `section .text` for the executable code instructions
- `section .bss` for uninitialized global and static data

One can also use labels, which give a name to a specific memory address to
structure their code. This can be used for program entry, functions or points to
jump to or call.

```asm
_start:
    ; instructions

loop:
    ; instructions
```

Instructions tell the CPU what to do, and generally look like this (dummy code):

```asm
mov rax, 1
push ebx
ret
```

## Registers

Registers are used to store data and manipulate it using instructions like `mov`
and `add`. One can write to it and then read from it. There are many registers.
I listed the most important here:

| **Register** | **Purpose**                               |
| ------------ | ----------------------------------------- |
| rax          | return value, syscall number, accumulator |
| rcx          | 4th argument of a function; Loop counter  |
| rdx          | 3rd argument of a function                |
| rsi          | 2nd argument of a function                |
| rdi          | 1st argument of a function                |
| rsp          | stack pointer (top of the stack)          |
| r8-r15       | General purpose                           |

## Stack

The stack is a region of memory for storing temporary data, like function
parameters and local variables. The stack grows downwards in memory, meaning
that as you push data onto the stack, the stack pointer (RSP) decreases.

Using `push` and `pop` we can manipulate the stack.

- `push rax` adds an element to the top of the stack and decreaes the stack
  pointer by the size of the data being pushed
- `pop rbx` removes the element at the top of the stack and moves it into the
  specified register. Therefore it increases the stack pointer by the size of
  the data being popped.

## The data section

Use `section .data` to place initialized, writable global data in your binary.

Caution: Put large uninitialized buffers in `.bss` using `resb/resq` (keeps
binary smaller).

```asm
section .data
```

### Basic directives

- `db` defines byte(s) (useful for strings and raw bytes)
- `dw` defines 2‑byte words
- `dd` defines 4‑byte doublewords
- `dq` defines 8‑byte quadwords (useful for 64‑bit integers/pointers)
- `$` is the current assembly address
- `$ - label` computes the number of bytes from the specified label to the
  current assembly address
- `times n db 0` repeats a value n times

### Strings and lengths:

```asm
msg:    db "Hello, world!", 0x0a     ; newline-terminated string
len:    equ $ - msg                   ; compute length at assemble time
```

### Numeric values (note little-endian layout):

```asm
val32:  dd 0x11223344   ; bytes will be 44 33 22 11 in memory
val64:  dq 0x1122334455667788
```

### Arrays:

```asm
arr:    dq 1, 2, 3, 4    ; array of 64-bit integers
zeros:  times 8 db 0     ; 8 zero bytes
```

# First Steps with Hello World

This example will print "Hello World" to the console and return the exit code 0,
which stands for success.

```asm
section .data
    msg db "Hello, World!", 0x0a    ; defines a byte array containing the text "Hello, World!" plus a newline (0x0a)
    len equ $ - msg                 ; resolves to 14 (length of "Hello, World!")

section .text
    global _start

_start:
    ; write syscall: rax=1, rdi=fd, rsi=buf, rdx=count
    mov rax, 1              ; syscall write
    mov rdi, 1              ; file descriptor (stdout)
    mov rsi, msg            ; pointer to message
    mov rdx, len            ; message length
    syscall                 ; write(stdout, message, message_length) 

    ; exit syscall: rax=60, rdi=code
    mov rax, 60             ; syscall exit
    mov rdi, 0              ; exit code 0 (success)
    syscall
```

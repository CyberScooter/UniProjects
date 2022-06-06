	/*
Variable Name (referenced in comments for clarity) -> Register:

indexerOne                  -> r22
currentLetterMorseCode      -> r23
currentLetterInputCount     -> r24
rightMostMorseCodeBitValue  -> r26
arrayOffset                 -> r25
delayAmount                 -> r27

*/

#define __SFR_OFFSET 0
#include <avr/io.h> 

sbi DDRB, 5 ;; set pin 13 as output

test_setup:
    push r22 ;; push registers' values onto stack, so they can be restored afterwards
    push r23
    push r24
    push r26
    push r25
    push r27
    ldi r25, 0x00 ;; initialise arrayOffset to 0
    ldi r22, 0x01 ;; indexerOne doesn't change
    get_iteration_letter: 

        ;; INPUT: arrayOffset (r25)
        ;; OUTPUT: updated byte values for currentLetterMorseCode (r23) and currentLetterInputCount (r24)

        ;; read "alphabet_morseCodes" array into Z register
        ldi r30, lo8(alphabet_morseCodes) 
        ldi r31, hi8(alphabet_morseCodes) 

        add r30, r25	      
        brcc 1f		       	
        inc r31		      
                              
        1:	
        lpm r23, Z ;; index array

        ;; read "alphabet_inputCounts" array into Z register 
        ldi r30, lo8(alphabet_inputCounts) 
        ldi r31, hi8(alphabet_inputCounts) 

        add r30, r25	      
        brcc 2f		       	
        inc r31		       		
                               
        2:	
        lpm r24, Z ;; index array
        ;; ---------------- 
        loop: 
            
            ;; check to see if we've finished looping through 'this' letter's morse code
            cp r22, r24
            breq looped_through_morseCode

            ;; is 'this' morse code iteration's bit the equivalent of a long or short press?
            ldi r26, 0x01
            and r26, r23
            cpi r26, 0x01 ;; if r26 == 0x01, then 'this' morse code iteration's bit is the equivalent of a long press. branch to "isLong" method. else, don't.
            breq isLong

            ;; press for 100 ms (a short press)
            sbi PORTB, 5
            ldi r27, 1
            call delay
            cbi PORTB, 5
            ;; logical shift right register that track the current letter's morse code and input count to the right, by 1
            lsr r23
            lsr r24
            ldi r27, 1 ;; inter-signal delay of 100ms
            call delay
            jmp loop ;; loop back to get 'next' bit of the current morse code 
            isLong:
             ;; press for 300 ms (a long press)
                sbi PORTB, 5
                ldi r27, 3
                call delay
                cbi PORTB, 5
                ;; logical shift right register that track the current letter's morse code and input count to the right, by 1
                lsr r23
                lsr r24
                ldi r27, 1 ;; inter-signal delay of 100ms
                call delay 
                jmp loop 

        looped_through_morseCode:
            ldi r27, 7 ;; delay between each letter
            call delay
            inc r25 ;; increment the arrayOffset (that'll index our arrays)
            cpi r25, 0x1A ;; if the arrayOffset's value is equal to our arrays' length (our current message to encode is the alphabet, so arrays' length is 26), then end_tests - else, get the next letter's indexes from the arrays
            breq end_tests
            jmp get_iteration_letter

    end_tests:
        pop r27 ;; restore registers
        pop r25
        pop r26
        pop r24
        pop r23
        pop r22
        ldi r27, 5 ;; delay for 500ms 
        call delay
        call test_setup ;; loop through message again


;; -------- Tables ----------------------
alphabet_morseCodes:
    .byte   0x02, 0x01, 0x05, 0x01, 0x00, 0x04, 0x03, 0x00, 0x00, 0xE, 0x05, 0x02, 0x03, 0x01, 0x7, 0x06, 0xB, 0x02, 0x00, 0x01, 0x04, 0x08, 0x06, 0x09, 0xD, 0x03
            ;A   B      C       D     E     F     G     H     I     J   K     L    M      N     O    P      Q   R      S    T      U    V      W     X    Y   Z
alphabet_inputCounts:
    .byte 0x04, 0x10, 0x10, 0x08, 0x02, 0x10, 0x08, 0x10, 0x04, 0x10, 0x08, 0x10, 0x04, 0x04, 0x08, 0x10, 0x10, 0x08, 0x08, 0x02, 0x08, 0x10, 0x08, 0x10, 0x10, 0x10
; --------------------------------------------




;; ----------- Delay Method --------------------------
delay:

    push r27 
    push r17
    push r2
    push r1
        
    outermost_delay:

        ldi r17, (82/10)		; 100ms delay, see below (changed from 82 to 8, so ten times less than a 1000ms delay (so 100ms))

        outer_delay:
            clr r1 			
            middle_delay:
                clr r2			
                inner_delay:		   	
                    dec r2			
                    brne inner_delay	

                    dec r1			
                            
                    brne middle_delay	

                    dec r17               

                    brne outer_delay	
                    dec r27
                    brne outermost_delay

                    pop r1
                    pop r2
                    pop r17
                    pop r27
                    
                    ret
; --------------------------------------------
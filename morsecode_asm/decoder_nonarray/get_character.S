

#include "morseCodeDefinitions.S"
#include "7segment.S"


.global character

;;When the button is released the label in the morseCode.s will use this file to compare the count stored
;;whilst taking inputs to each of the predefined counts in these files. If they match then further comparison
;;is made to work out the letter with the same count which has the same value using the morseCodeDefinitions file
;;[FOR GROUP REMOVE LATER] the order of the execution of the code matters, analyse properly

character:

cpi r23,-1 ;if count is -1, determined by timing.S
breq error ;go to error

cpi r23,1 ;if count is equal to one
breq one

cpi r23,2 ;if count is equal to two
breq two

cpi r23,3 ;if count is equal to three
breq three

cpi r23,4 ;if count is equal to four
breq four

subi r23,5	; subtracts 5 from the value in register r23, 5 meaning the minimum invalid amount of times the buttons pressed
brpl error	;branches to error label if result above is positive

default: ; default value used to remember the digit on display
    rjmp buffer

error:
    ldi r25, ERROR ;loads error bit display values from 7segment.S file to r25 so that it can be taken to main part of code
    rjmp buffer     ; and used to display an error


one:
    ldi r25, CHAR_E ;load bit values for pattern CHARACTER E to display on digital display to r25
    cpi r24, char_E ;compare whether r24 is the same as the bit value of character E in definitions
    breq buffer     ;if it is branch buffer

    ldi r25, CHAR_T
    cpi r24, char_T
    breq buffer

    
two:

    ldi r25, CHAR_A
    cpi r24, char_A
    breq buffer

    ldi r25, CHAR_I
    cpi r24, char_I
    breq buffer

    ldi r25, CHAR_M
    cpi r24, char_M
    breq buffer

    ldi r25, CHAR_N
    cpi r24, char_N
    breq buffer

    rjmp error ;error if the count is two but combinations dont match

buffer:
    ret

three:

    ldi r25, CHAR_D
    cpi r24, char_D
    breq buffer

    ldi r25, CHAR_G
    cpi r24, char_G
    breq buffer

    ldi r25, CHAR_K
    cpi r24, char_K
    breq buffer

    ldi r25, CHAR_O
    cpi r24, char_O
    breq buffer

    ldi r25, CHAR_R
    cpi r24, char_R
    breq buffer

    ldi r25, CHAR_S
    cpi r24, char_S
    breq buffer

    ldi r25, CHAR_U
    cpi r24, char_U
    breq buffer

    ldi r25, CHAR_W
    cpi r24, char_W
    breq buffer

    rjmp error

four:

    ldi r25, CHAR_B
    cpi r24, char_B
    breq buffer

    ldi r25, CHAR_C
    cpi r24, char_C
    breq buffer

    ldi r25, CHAR_F
    cpi r24, char_F
    breq buffer

    ldi r25, CHAR_H
    cpi r24, char_H
    breq buffer

    ldi r25, CHAR_J
    cpi r24, char_J
    breq buffer

    ldi r25, CHAR_L
    cpi r24, char_L
    breq buffer

    ldi r25, CHAR_P
    cpi r24, char_P
    breq buffer

    ldi r25, CHAR_Q
    cpi r24, char_Q
    breq buffer

    ldi r25, CHAR_V
    cpi r24, char_V
    breq buffer

    ldi r25, CHAR_X
    cpi r24, char_X
    breq buffer

    ldi r25, CHAR_Y
    cpi r24, char_Y
    breq buffer

    ldi r25, CHAR_Z
    cpi r24, char_Z
    breq buffer

    rjmp error


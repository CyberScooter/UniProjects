
	CPU_FREQ = 16000000
	TICKS_PER_SEC = CPU_FREQ / (256 * 1024)

;; FOR TESTING, SET TO 500MS (also have to set the timeout time assign to OCR1A register)
	DECISION_LIMIT = 2 * TICKS_PER_SEC / 10 ; 200ms DECISION BETWEEN DOT (LESS THAN 200MS) AND DASH (GREATER THAN 200MS)


#define __SFR_OFFSET 0
#include <avr/io.h> 
#include "variables_setup.S"

	.section .text
	.global main
main:	

	ldi r16, ALL_SEGS
	out DDRD, r16           
	ldi r24, DEFAULT ;; dont display anything when powered on
	out PORTD, r24

	sbi PORTB, BUTTON 	; follows inverse logic (taught during labs) pressed button is 1, depressed button read as 0.
				
	ldi r24, 0x00 ;; morse code register, stores the morsecode
	ldi r25, 0x01 ;; indexer allows that bits in the morsecode to be set
	ldi r31, 0x00 ;;overflow register used like boolean register to make sure there is no overflow on Z register

	;; LAB8 SOLUTION  - (ms you want it on for / 16) <-- convert that to hexadecimal (from base 10)
	ldi r16, 0x19 ;; time, in milli-seconds of button inaction for "timer1_compa_isr" method to be called 
	sts OCR1AH, r16 ;; OCR1A's high byte register (made up of 2 registers) is set to r16's value 
	clr r16
	sts OCR1AL, r16 

	;; set up the timer ([ATmega328p], Section 15.11.1 (p126))

	clr r16
	sts TCCR1A, r16 	; setting timer output mode: no output
						; pin used, normal counting up. 

	;; enable input capture interrupt (to time button presses) and
	;; timer overflow interrupt that compares to value in OCR1A register
	ldi r16, _BV(ICIE1) | _BV(OCIE1A) ;; lab 8 solution
	sts TIMSK1, r16

	;; enable noise canceller, set prescaler to 1024, and start
	;; timer in 'Compare Match' mode.
	ldi r16,  _BV(ICNC1) | _BV(CS12) | _BV(CS10) | _BV(WGM12)
	sts TCCR1B, r16

	clr r19			; reset overflow flag to defined state

	sei			; enable interrupts globally.

fourE4:	rjmp fourE4 		; do nothing :-) just wait for the interrupts to occur -- forever.
				; 
	;; end of setup



;; ------------------------------------------------------------- TIMER1 OVERFLOW INTERRUPT ------------------------------------------------------

;;; This interrupt service routine is currently called whenever timer1 has
;;; an overflow, ie when more than 0.4s have elapses since the last button release. 
	
	.global timer1_compa_isr  ; export symbol to overwrite weak
				; definition in init.S

;;; This is the start of the interrupt service routine:
timer1_compa_isr:	

	push r16	
	in r16, SREG		; save the status register.
	push r16

	;; check whether we are waiting for a button press or release:
	lds r16, TCCR1B
	sbrs r16, ICES1 	; skip if waiting for positive edge (ie for button release)
	rjmp awaiting_press

awaiting_release:
	;;  make sure also an overly long press is always recognised
	;;  as a long press, irrespective of a timer overrun:

	ser r19 		; using r19 as a flag to indicate a
				; timer overflow has occured.
	rjmp 1f

awaiting_press:	
	ldi r16, _BV(BUTTON) ; pullup button (we're waiting for button to be pressed) --- this would already be 1 tho, so this is irrelevant - ask for Hrithik's opinion.
	out PORTB, r16
	call get_letter 
	out PORTD, r24
	ldi r24, 0x00 ;; morse code
	ldi r25, 0x01 ;; indexer
	ldi r31, 0x00 ;;resets overflow to 0

1:	pop r16
	out SREG, r16 		; restore status register
	pop r16

	reti

;; INPUT: r24
;; OUTPUT: r24 is set to the matched PORTD config
get_letter:

	push r30		; save Z reg low
	push r31		; save Z reg hi

;; need a way to distinguish between "00" and "0", so we do this:
	or r24, r25 ;; set the current index in the morse code to 1 (00 and 0 have different indexes... that's the differentiating 'thing')
				;; the or of r24, r25 allows it to create a bit valued stored in r24 that is the same as the index we're looking for

	cpi r31, 0x01 ;if r31 is increased, overflow has occured
	breq get_letter_too_big ;;get_letter_too_big is run

	cpi r25, 0x01 ;; if indexor has not moved
	breq default_config ;;display is set to none

	cpi r24, 0x20 		;compare morse code with bit 32
	brge get_letter_too_big ;go to get_letter_too_big if r24 is bigger than 32 bit

							
	ldi r30, lo8(digit_table_1) ; make Z point to this array
	ldi r31, hi8(digit_table_1) 

	jmp index_matched_array

index_matched_array:	
	add r30, r24	       ; the number in r24 is the offset into the table
	brcc 1f		       		; if no overflow from Z low, continue at 1
	inc r31		       		; else add overflow to Z high byte
							; when overflow in r24 it MIGHT use another register
1:	
	lpm r24, Z		; load seven seg representation from the table (in prog memory)
	
	pop r31			; restore used registers.
	pop r30

	ret			; return from subroutine

digit_table_1: 
	.byte INDEX_0, INDEX_1, INDEX_2, INDEX_3, INDEX_4, INDEX_5, INDEX_6, INDEX_7, INDEX_8, INDEX_9, INDEX_10, INDEX_11, INDEX_12, INDEX_13, INDEX_14, INDEX_15, INDEX_16, INDEX_17, INDEX_18, INDEX_19, INDEX_20, INDEX_21, INDEX_22, INDEX_23, INDEX_24, INDEX_25, INDEX_26, INDEX_27, INDEX_28, INDEX_29, INDEX_30, INDEX_31

get_letter_too_big:

	ldi r24, NOT_RECOGNISED

	pop r31			; restore used registers.
	pop r30

	ret			; return from subroutine

default_config:

	ldi r24, DEFAULT

	pop r31			; restore used registers.
	pop r30

	ret			; return from subroutine

;; -------------------------------------------------------- BUTTON ACTION INTERRUPT (WHENEVER BUTTON 
;;														     CHANGES DIRECTION - AKA: ICP1 (PORTB0) BIT CHANGES) ----------------------------------------------------
	
	.global timer1_cpt_isr

timer1_cpt_isr:

	push r8

	in r8, SREG 		; save the status register.
	push r8

	lds r8, ICR1L		; get the timer count when the capture event happened.
	lds r8, ICR1H           ; we discard the low part, only
				; interested in the high part, but
				; reading low byte is necessary to get
				; a correct high byte in ICR1H, see
				; documentation [ATmega328p] Section 15.11.7 p131 
	push r17				

	;; debounce button:

	mov r17,r19		;  If there is no timer-overflow (ie a
				;  very long button press and
	or r17,r8		;  ICR1H is still zero, then 
				;  less than 16ms have elapsed since
				;  last release or press
	breq debounce		;  and we do nothing

	clr r17
	sts TCNT1H, r17 	; reset timer, first writing the high byte to the latch
	sts TCNT1L, r17		; then the low byte -- Section 16.3 of [328] again.

	;; check whether we were looking for a positive or a negative edge:
	lds r17, TCCR1B
	sbrs  r17, ICES1	; skip next instruction if positive edge dedection.
	
	rjmp pressed		; we have a negative edge ie button
				; has been pressed

	;; positive edge, button has been released
	rcall released

	andi r17, ~(_BV(ICES1)) ; we have had positive edge, so next
				; time looking for negative edge
	rjmp end_isr

	
pressed:
	ori r17, _BV(ICES1)	; next time detect positive edge, ie a
				; button release.
	ldi r26, 0xff ;; INCREMENTAL PROGRESS - SWITCH OFF WHEN BUTTON IS PRESSED
	
	out PORTD, r26
	

end_isr:
	sts TCCR1B, r17 	; write r17 to TCCR1B to activate the
				; change in edge detection.
	
debounce:
	pop r17
	pop r8
	out SREG, r8		; restore status register
	pop r8

	reti

;;; This subroutine handles the detection of a button release (ie the
;;; end of a button press)
;;; It expects the durations of button presses in 16ms ticks in r8

released:

	push r16

	tst r19 		; Did we have a timer overflow
				; (ie more than TIMEOUT time since the
				; last released of the button?
	brne long_press		; if yes, then signal is a long
				; press in any case

	;; is the signal longer than DECISION_LIMIT?
	ldi r16, DECISION_LIMIT
	cp r8,r16
	brcs short_press		; if it is shorter jump to label short
	
long_press: ;; set to 1 (that is equiv to "-")
	ldi r16, _BV(BUTTON) ; pull-up for button on. INCREMENTAL PROGRESS - last build
	or r24, r25 ;; INCREMENTAL PROGRESS - last build
	rjmp 1f

short_press: ;; leave to 0 (that is equiv to ".")

	ldi r16, _BV(BUTTON) ; pull-up on. INCREMENTAL PROGRESS - last build
1:	out PORTB, r16		; transfer bitpattern into PORTB (ie
				; do switch the LEDs).

	cpi r25, 0x80 ;if r25 is 128/overflow
	brne underflow	;if its not equal then go to underflow
	ldi r31, 0x01 ;else load bit value one to r31, this register is used like a boolean check to deal with overflow
underflow:
	add r25, r25 ;; INCREMENTAL PROGRESS - last build
	pop r16
	clr r19			; clear overflow flag in case it was set
	ret


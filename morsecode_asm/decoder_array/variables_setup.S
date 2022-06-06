	;; this file is used to set up the variable names to be used in morsecode.S file
    ;; the bits for to display the letters on the digital display is saved in the form of LETTER_$ where $ is the letter name
    ;; the index that stores each letter is stored in variables called INDEX_* where * is a number, these indexes are used as in the array in morsecode.S file
    ;; 
    
    
    SEG_A = 7		; top
	SEG_B = 1 		; upper right
	SEG_C = 2		; lower right
	SEG_D = 3		; bottom
	SEG_E = 4		; lower left
	SEG_F = 5		; upper left
	SEG_G = 6		; middle


	ALL_SEGS = _BV(SEG_A) | _BV(SEG_B) | _BV(SEG_C) | _BV(SEG_D) | _BV(SEG_E) | _BV(SEG_F) | _BV(SEG_G) 

								;; LETTERS ORDERED BY INDEX:
	
	;; ARRAY:
	;; -- NOT RECOGNISED ;; 0
	;; -- NOT RECOGNISED ;; 1
	LETTER_E = _BV(SEG_A) | _BV(SEG_D) | _BV(SEG_E) | _BV(SEG_F) | _BV(SEG_G) ;; 2
	LETTER_T = _BV(SEG_D) | _BV(SEG_E) | _BV(SEG_F) | _BV(SEG_G) ;; 3
	LETTER_I = _BV(SEG_C) ;; 4
	LETTER_N = _BV(SEG_E) | _BV(SEG_G) | _BV(SEG_C) ;; 5
    LETTER_A = _BV(SEG_A) | _BV(SEG_B) | _BV(SEG_C) | _BV(SEG_E) | _BV(SEG_F) | _BV(SEG_G) ;; 6
	LETTER_M = _BV(SEG_A) | _BV(SEG_E) | _BV(SEG_G) | _BV(SEG_C) ;; 7
	
	LETTER_S = _BV(SEG_A) | _BV(SEG_C) | _BV(SEG_D) | _BV(SEG_F) | _BV(SEG_G) ;; 8
	LETTER_D = _BV(SEG_B) | _BV(SEG_C) | _BV(SEG_D) | _BV(SEG_E) | _BV(SEG_G) ;; 9
	LETTER_R = _BV(SEG_E) | _BV(SEG_G) ;; 10
	LETTER_G = _BV(SEG_A) | _BV(SEG_C) | _BV(SEG_D) | _BV(SEG_E) | _BV(SEG_F) ;; 11
	LETTER_U = _BV(SEG_B) | _BV(SEG_C) | _BV(SEG_D) | _BV(SEG_E) | _BV(SEG_F) ;; 12
	LETTER_K = _BV(SEG_A) | _BV(SEG_C) | _BV(SEG_E) | _BV(SEG_F) | _BV(SEG_G) ;; 13
	LETTER_W = _BV(SEG_B) | _BV(SEG_F) | _BV(SEG_G) | _BV(SEG_D) ;; 14
	LETTER_O = _BV(SEG_E) | _BV(SEG_D) | _BV(SEG_C) | _BV(SEG_G) ;; 15

	LETTER_H = _BV(SEG_C) | _BV(SEG_E) | _BV(SEG_F) | _BV(SEG_G) ;; 16
	LETTER_B = _BV(SEG_C) | _BV(SEG_D) | _BV(SEG_E) | _BV(SEG_F) | _BV(SEG_G) ;; 17 
	LETTER_L = _BV(SEG_D) | _BV(SEG_E) | _BV(SEG_F) ;; 18
	LETTER_Z = _BV(SEG_A) | _BV(SEG_B) | _BV(SEG_D) | _BV(SEG_E) | _BV(SEG_G) ;; 19 
	LETTER_F = _BV(SEG_A) | _BV(SEG_E) | _BV(SEG_F) | _BV(SEG_G) ;; 20
	LETTER_C = _BV(SEG_A) | _BV(SEG_D) | _BV(SEG_E) | _BV(SEG_F) ;; 21
	LETTER_P = _BV(SEG_A) | _BV(SEG_B) | _BV(SEG_E) | _BV(SEG_F) | _BV(SEG_G) ;; 22
	;; -- NOT RECOGNISED ;; 23

	LETTER_V = _BV(SEG_E) | _BV(SEG_D) | _BV(SEG_C) ;; 24
	LETTER_X = _BV(SEG_B) | _BV(SEG_C) | _BV(SEG_E) | _BV(SEG_F) | _BV(SEG_G) ;; 25
	;; -- NOT RECOGNISED ;; 26
	LETTER_Q = _BV(SEG_A) | _BV(SEG_B) | _BV(SEG_C) | _BV(SEG_F) | _BV(SEG_G) ;; 27
	;; -- NOT RECOGNISED ;; 28
	LETTER_Y = _BV(SEG_B) | _BV(SEG_C) | _BV(SEG_D) | _BV(SEG_F) | _BV(SEG_G) ;; 29
	LETTER_J = _BV(SEG_B) | _BV(SEG_C) | _BV(SEG_D) ;; 30
	;; -- NOT RECOGNISED ;; 31

	NOT_RECOGNISED = _BV(SEG_D)
	DEFAULT = _BV(ALL_SEGS)


;; 0 == short
;; 1 == long

;; BELOW IS WHAT WE ACTUALLY REFERENCE IN OUR CODE
;; LETTERS A AND B ARE DONE

;; morse code input required to trigger a desired index:
;; 1 - convert index desired from base 10 to binary
;; 2 - remove left-most (most significant) 1
;; 3 - morse code is read from right to left
;; 4 - NOTE: 0 == short, 1 == long

	INDEX_0 = ~(NOT_RECOGNISED) ;; note: this index can never actually be indexed (min byte is 10 (that's equal to 2))
	INDEX_1 = ~(NOT_RECOGNISED) ;; note: this index can never actually be indexed (min byte is 10 (that's equal to 2))
    INDEX_2 = ~(LETTER_E) ;; 
    INDEX_3 = ~(LETTER_T) ;; 
	INDEX_4 = ~(LETTER_I) ;; 
	INDEX_5 = ~(LETTER_N) ;;
    INDEX_6 = ~(LETTER_A) ;;
    INDEX_7 = ~(LETTER_M) ;;

	INDEX_8 = ~(LETTER_S) 
	INDEX_9 = ~(LETTER_D) 
    INDEX_10 = ~(LETTER_R);;
    INDEX_11 = ~(LETTER_G) 
	INDEX_12 = ~(LETTER_U) 
	INDEX_13 = ~(LETTER_K) 
    INDEX_14 = ~(LETTER_W);;
    INDEX_15 = ~(LETTER_O) 

	INDEX_16 = ~(LETTER_H) 
	INDEX_17 = ~(LETTER_B) 
    INDEX_18 = ~(LETTER_L) 
    INDEX_19 = ~(LETTER_Z) 
	INDEX_20 = ~(LETTER_F) 
	INDEX_21 = ~(LETTER_C) 
    INDEX_22 = ~(LETTER_P);; 
    INDEX_23 = ~(NOT_RECOGNISED) 

	INDEX_24 = ~(LETTER_V) 
	INDEX_25 = ~(LETTER_X) 
    INDEX_26 = ~(NOT_RECOGNISED);; 
    INDEX_27 = ~(LETTER_Q) 
	INDEX_28 = ~(NOT_RECOGNISED) 
	INDEX_29 = ~(LETTER_Y)
    INDEX_30 = ~(LETTER_J);; 
    INDEX_31 = ~(NOT_RECOGNISED) 

	DEFAULT = ~(DEFAULT) 
	NOT_RECOGNISED = ~(NOT_RECOGNISED)
	
	BUTTON = 0 ;;; Button is connected to PIN 8, PORTB, Bit 0, because that doubles as the ICP1 for timer1.
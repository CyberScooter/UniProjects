#include <avr/io.h> 				

	;; the segments are connected to these pins of PORTD:
	
	SEG_A = 7		; top
	SEG_B = 1 		; upper right
	SEG_C = 2		; lower right
	SEG_D = 3		; bottom
	SEG_E = 4		; lower left
	SEG_F = 5		; upper LEFT
	SEG_G = 6		; middle

	;; a bit mask that contains all bits used:
	ALL_SEGS = _BV(SEG_A) | _BV(SEG_B) | _BV(SEG_C) | _BV(SEG_D) | _BV(SEG_E) | _BV(SEG_F) | _BV(SEG_G) 

;;these stores the bit values to set each of the parts of the seven segment digital display to light up for each character

	CHAR_A = ~(_BV(SEG_A) | _BV(SEG_B) | _BV(SEG_C) | _BV(SEG_E) | _BV(SEG_F) | _BV(SEG_G))
	CHAR_B = ~(ALL_SEGS)
	CHAR_C = ~(_BV(SEG_A) | _BV(SEG_D) | _BV(SEG_E) | _BV(SEG_F))
	CHAR_D = ~(_BV(SEG_B) | _BV(SEG_C) | _BV(SEG_D) | _BV(SEG_E) | _BV(SEG_G))
	CHAR_E = ~(_BV(SEG_A) | _BV(SEG_D) | _BV(SEG_E) | _BV(SEG_F) | _BV(SEG_G))
	CHAR_F = ~(_BV(SEG_A) | _BV(SEG_E) | _BV(SEG_F) | _BV(SEG_G))
	CHAR_G = ~(_BV(SEG_A) | _BV(SEG_C) | _BV(SEG_D) | _BV(SEG_E) | _BV(SEG_F) | _BV(SEG_G))
	CHAR_H = ~(_BV(SEG_C) | _BV(SEG_E) | _BV(SEG_F) | _BV(SEG_G))
	CHAR_I = ~(_BV(SEG_F) | _BV(SEG_E))
	CHAR_J = ~(_BV(SEG_B) | _BV(SEG_C) | _BV(SEG_D))
	CHAR_K = ~(_BV(SEG_E) | _BV(SEG_F) | _BV(SEG_G) | _BV(SEG_B) | _BV(SEG_C))
	CHAR_L = ~(_BV(SEG_F) | _BV(SEG_E) | _BV(SEG_D))
	CHAR_M = ~(_BV(SEG_C) | _BV(SEG_F) | _BV(SEG_G))
	CHAR_N = ~(_BV(SEG_A) | _BV(SEG_B) | _BV(SEG_C) | _BV(SEG_E) | _BV(SEG_F))
	CHAR_O = ~(_BV(SEG_A) | _BV(SEG_B) | _BV(SEG_C) | _BV(SEG_D) | _BV(SEG_E) | _BV(SEG_F))
	CHAR_P = ~(_BV(SEG_A) | _BV(SEG_B) | _BV(SEG_E) | _BV(SEG_F) | _BV(SEG_G))
	CHAR_Q = ~(_BV(SEG_A) | _BV(SEG_B) | _BV(SEG_C) | _BV(SEG_F) | _BV(SEG_G))
	CHAR_R = ~(_BV(SEG_A) | _BV(SEG_E) | _BV(SEG_F))
	CHAR_S = ~(_BV(SEG_A) | _BV(SEG_C) | _BV(SEG_D) | _BV(SEG_F) | _BV(SEG_G))
	CHAR_T = ~(_BV(SEG_E) | _BV(SEG_F) | _BV(SEG_G) | _BV(SEG_D))
	CHAR_U = ~(_BV(SEG_C) | _BV(SEG_D) | _BV(SEG_E))
	CHAR_V = ~(_BV(SEG_B) | _BV(SEG_C) | _BV(SEG_D) | _BV(SEG_E) | _BV(SEG_F))
	CHAR_W = ~(_BV(SEG_B) | _BV(SEG_G) | _BV(SEG_E))
	CHAR_X = ~(_BV(SEG_B) | _BV(SEG_C) | _BV(SEG_E) | _BV(SEG_F) | _BV(SEG_G))
	CHAR_Y = ~(_BV(SEG_B) | _BV(SEG_C) | _BV(SEG_D) | _BV(SEG_F) | _BV(SEG_G))
	CHAR_Z = ~(_BV(SEG_E) | _BV(SEG_F))
	ERROR = ~(_BV(SEG_A)  | _BV(SEG_D) | _BV(SEG_G))



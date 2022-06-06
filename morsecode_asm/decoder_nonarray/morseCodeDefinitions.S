#include <avr/io.h> 	

;;This is like a dictionairy which stores each letter to a unique hexa value
;;in the morseCode.S file the bits are added through bit shifting and the result is compared
;;using these characters below in order to determine which character the program is using


              ; bit equivalent
char_A = 0x1  ;01
char_B = 0x8  ;1000
char_C = 0xA  ;1010
char_D = 0x4  ;100
char_E = 0x0  ;0
char_F = 0x2  ;0010
char_G = 0x6  ;110
char_H = 0x0  ;0000
char_I = 0x0  ;00
char_J = 0x7  ;0111
char_K = 0x5  ;101
char_L = 0x4  ;0100
char_M = 0x3  ;11
char_N = 0x2  ;10
char_O = 0x7  ;111
char_P = 0x6  ;0110
char_Q = 0xD  ;1101
char_R = 0x2  ;010
char_S = 0x0  ;000
char_T = 0x1  ;1
char_U = 0x1  ;001
char_V = 0x1  ;0001
char_W = 0x3  ;011
char_X = 0x9  ;1001
char_Y = 0xB  ;1011
char_Z = 0xC  ;1100
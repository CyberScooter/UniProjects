    Tests: 

1 - Go through alphabet, only starting on the next letter once the previous letter’s LEDs are off. 

2 - Trigger all the “NOT_RECOGNISED” indexes: 23,26,28,31  (apart from indexes 0 and 1... because the smallest index you can index is 2)

3 - Begin on a second letter as soon as the letter before it has appeared. Try:
    BB
    CB
    BC
    CC
    ST
    TS
    TS - BREAK - S
    SS
    TT

4 - Enter a code that requires an index larger than 31 

 

    Current Build’s Tests’ Results: 

1 - Pass. Note: as the deciding time is 200ms, it's easy to make a mistake. perhaps i should increase the deciding time to 500ms during tests?

2 - Pass.

3 - Pass.

4 - Pass.

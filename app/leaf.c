#include <stdio.h>
#include <stdlib.h>

// This function processes a leaf node and returns a greeting string.
// Note: A static buffer is used for simplicity.
char* process_leaf(int node) {
    static char buffer[256];
    sprintf(buffer, "Leaf(%d) ", node);
    return buffer;
}

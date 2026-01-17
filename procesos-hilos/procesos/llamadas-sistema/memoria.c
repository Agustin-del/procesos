#include <stdio.h>
#include <stdlib.h>

int main() {
  int *ptr;
  ptr = (int*) malloc(sizeof(int));

  if(ptr == NULL) {
    printf("No se puede asignar memoria\n");
    return 1;
  }

  *ptr = 42;

  printf("Valor de ptr: %d\n", *ptr);

  free(ptr);

  return 0;
}

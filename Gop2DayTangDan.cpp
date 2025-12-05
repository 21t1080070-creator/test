#include <stdio.h>

void merge(int a[], int n, int b[], int m, int c[]) {
    int i = 0, j = 0, k = 0;

    while (i < n && j < m) {
        if (a[i] <= b[j])
            c[k++] = a[i++];
        else
            c[k++] = b[j++];
    }

    while (i < n)
        c[k++] = a[i++];

    while (j < m)
        c[k++] = b[j++];
}

int main() {
    int n, m;

    printf("Nhap so luong phan tu cua mang a (tang dan): ");
    scanf("%d", &n);

    int a[n];
    printf("Nhap %d phan tu (tang dan):\n", n);
    for (int i = 0; i < n; i++) {
        printf("a[%d] = ", i);


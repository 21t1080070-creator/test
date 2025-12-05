#include <stdio.h>

int binary_search(int a[], int n, int x) {
    int left = 0, right = n - 1;

    while (left <= right) {
        int mid = (left + right) / 2;

        if (a[mid] == x)
            return mid;
        if (a[mid] < x)
            left = mid + 1;
        else
            right = mid - 1;
    }

    return -1; 
}

int main() {
    int n, x;

    printf("Nhap so luong phan tu n: ");
    scanf("%d", &n);

    int a[n];
    printf("Nhap %d phan tu theo thu tu TANG DAN:\n", n);
    for (int i = 0; i < n; i++) {
        printf("a[%d] = ", i);
        scanf("%d", &a[i]);
    }

    printf("Nhap gia tri x can tim: ");
    scanf("%d", &x);

    int kq = binary_search(a, n, x);

    if (kq == -1)
        printf("Khong tim thay %d trong mang!\n", x);
    else
        printf("Tim thay %d tai vi tri index = %d\n", x, kq);

    return 0;
}


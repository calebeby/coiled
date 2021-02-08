Math:

Constants:
k - spring constant
b - friction/damping coefficient
m - mass

Underdamped spring (what is used): https://www.desmos.com/calculator/br29m7cic9
Overdamped spring (not being used): https://www.desmos.com/calculator/i0kyjyxb4u
https://math.libretexts.org/Bookshelves/Calculus/Book%3A_Calculus_(OpenStax)/17%3A_Second-Order_Differential_Equations/17.3%3A_Applications_of_Second-Order_Differential_Equations

alpha + beta i:
alpha = -b/2m
beta = (b^2 - 4mk) / 2m

c1 = x0
c2 = (v0 - alpha c1) / beta

x(t) = e^(alpha t) (c1 cos(beta t) + c2 sin(beta t))
x'(t) = e^(alpha t) (sin(beta t) (alpha c2 - beta c1) + cos(beta t) (alpha c1 + beta c2))

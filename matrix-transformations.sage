# https://franklinta.com/2014/09/08/computing-css-matrix3d-transforms/
var('x0,y0,x1,y1,x2,y2,x3,y3')
var('u0,v0,u1,v1,u2,v2,u3,v3')

A = matrix([
  [x0, y0, 1,  0,  0, 0, -u0 * x0, -u0 * y0],
  [ 0,  0, 0, x0, y0, 1, -v0 * x0, -v0 * y0],
  [x1, y1, 1,  0,  0, 0, -u1 * x1, -u1 * y1],
  [ 0,  0, 0, x1, y1, 1, -v1 * x1, -v1 * y1],
  [x2, y2, 1,  0,  0, 0, -u2 * x2, -u2 * y2],
  [ 0,  0, 0, x2, y2, 1, -v2 * x2, -v2 * y2],
  [x3, y3, 1,  0,  0, 0, -u3 * x3, -u3 * y3],
  [ 0,  0, 0, x3, y3, 1, -v3 * x3, -v3 * y3],
])

var('h0,h1,h2,h3,h4,h5,h6,h7,h8')

# h = vector([h0, h1, h2, h3, h4, h5, h6, h7, h8])
b = vector([u0, v0, u1, v1, u2, v2, u3, v3])

h = A.solve_right(b)

print(latex(h[0]))

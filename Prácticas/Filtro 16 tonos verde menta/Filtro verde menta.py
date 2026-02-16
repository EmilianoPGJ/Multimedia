#Filtro verde menta
def obtener_dimensiones_bmp(metadata):
    ancho = int.from_bytes(metadata[18:22], byteorder='little')
    alto = int.from_bytes(metadata[22:26], byteorder='little')
    return ancho, alto

def calcular_padding(ancho):    
    bytes_por_fila = ancho * 3
    padding = (4 - (bytes_por_fila % 4)) % 4
    return padding

file = open('/content/images/volcan.bmp','rb')
fileo = open('/content/images/volcan2.bmp','wb')
metadata = file.read(54)
fileo.write(metadata)
ancho, alto = obtener_dimensiones_bmp(metadata)
padding_original = calcular_padding(ancho)


paleta_verde_menta = [  
    [0xE8, 0xF5, 0xE0],
    [0xDA, 0xF0, 0xDA],
    [0xCF, 0xEB, 0xD7],      
    [0xD7, 0xE1, 0xB7],
    [0xC7, 0xDB, 0xAF],
    [0xBC, 0xD4, 0xA8],        
    [0xAC, 0xC9, 0x9C],  
    [0x9E, 0xBE, 0x93],  
    [0x93, 0xB5, 0x8C],      
    [0x7E, 0xA8, 0x7E], 
    [0x72, 0x99, 0x72], 
    [0x68, 0x8C, 0x68],         
    [0xBA, 0xC2, 0xA8], 
    [0xA8, 0xB2, 0x99], 
    [0x8A, 0x9E, 0x8A], 
    [0x4F, 0x6B, 0x4F] 
]

def distancia_color(color1, color2):  
    return sum((a - b) ** 2 for a, b in zip(color1, color2)) ** 0.5

def color_verde_menta(b, g, r):
    pixel_bgr = [b, g, r]
    distancias = [distancia_color(pixel_bgr, color) for color in paleta_fosfofilita]
    return paleta_verde_menta[distancias.index(min(distancias))]

file.seek(54, 0)
no_pix = 0
fila_actual = 0

while fila_actual < abs(alto):
    for columna in range(ancho):
        pixel_data = file.read(3)
        if len(pixel_data) == 3:
            b, g, r = pixel_data[0], pixel_data[1], pixel_data[2]
            nuevo_color = color_verde_menta(b, g, r)
            fileo.write(bytes(nuevo_color))
            no_pix += 1
    
    if padding_original > 0:
        padding_data = file.read(padding_original)
        if len(padding_data) == padding_original:
            fileo.write(padding_data)
    
    fila_actual += 1

file.close()
fileo.close()

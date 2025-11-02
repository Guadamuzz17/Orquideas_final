#!/usr/bin/env python3
"""
Script para extraer datos del SQL dump y convertirlos a formato PHP array
para el seeder Evento2024Seeder.php

Uso:
    python extraer_datos_sql.py

Genera archivos:
    - participantes_2024.txt
    - orquideas_2024.txt
    - inscripciones_2024.txt
    - ganadores_2024.txt
"""

import re
import json
from pathlib import Path

def limpiar_valor(valor):
    """Limpia y formatea un valor del SQL para PHP"""
    valor = valor.strip()

    # NULL
    if valor.upper() == 'NULL':
        return 'NULL'

    # Números
    if valor.isdigit():
        return valor

    # Fechas y strings - escapar comillas
    if valor.startswith("'") and valor.endswith("'"):
        contenido = valor[1:-1]
        # Escapar comillas simples para PHP
        contenido = contenido.replace("'", "\\'")
        return f"'{contenido}'"

    # Hexadecimal (para qr_code)
    if valor.startswith('0x'):
        return 'NULL'  # Ignorar QR codes antiguos

    return valor

def extraer_insert_values(sql_content, tabla):
    """Extrae los VALUES de un INSERT INTO específico"""
    # Patrón para encontrar INSERT INTO tabla ... VALUES (...)
    patron = rf"INSERT INTO `{tabla}`\s*\([^)]+\)\s*VALUES\s*(.*?);"

    matches = re.findall(patron, sql_content, re.DOTALL | re.IGNORECASE)

    registros = []
    for match in matches:
        # Dividir por filas usando regex para encontrar los paréntesis balanceados
        filas = re.findall(r'\(([^)]+)\)', match)

        for fila in filas:
            # Dividir por comas, pero respetando strings
            valores = []
            temp = ""
            en_string = False

            for char in fila + ',':
                if char == "'" and (not temp or temp[-1] != '\\'):
                    en_string = not en_string
                    temp += char
                elif char == ',' and not en_string:
                    if temp.strip():
                        valores.append(limpiar_valor(temp.strip()))
                    temp = ""
                else:
                    temp += char

            if valores:
                registros.append(valores)

    return registros

def generar_array_php(registros, variable_name, columnas):
    """Genera código PHP con array formateado"""
    php_code = f"        ${variable_name} = [\n"

    for registro in registros:
        # Crear array con valores
        valores_str = ", ".join(registro)
        php_code += f"            [{valores_str}],\n"

    php_code += "        ];\n"

    return php_code

def main():
    # Leer archivo SQL
    sql_file = Path('u245906636_orquideasAAO.sql')

    if not sql_file.exists():
        print(f"❌ Error: No se encontró el archivo {sql_file}")
        print("   Asegúrate de que el archivo SQL esté en el mismo directorio.")
        return

    print("📖 Leyendo archivo SQL...")
    with open(sql_file, 'r', encoding='utf-8') as f:
        sql_content = f.read()

    print("\n🔍 Extrayendo datos...")

    # Extraer participantes
    print("   - Participantes...")
    participantes = extraer_insert_values(sql_content, 'tb_participante')
    print(f"     ✅ {len(participantes)} registros encontrados")

    # Extraer orquídeas
    print("   - Orquídeas...")
    orquideas = extraer_insert_values(sql_content, 'tb_orquidea')
    print(f"     ✅ {len(orquideas)} registros encontrados")

    # Extraer inscripciones
    print("   - Inscripciones...")
    inscripciones = extraer_insert_values(sql_content, 'tb_inscripcion')
    print(f"     ✅ {len(inscripciones)} registros encontrados")

    # Extraer ganadores
    print("   - Ganadores...")
    ganadores = extraer_insert_values(sql_content, 'tb_ganadores')
    print(f"     ✅ {len(ganadores)} registros encontrados")

    # Generar archivos PHP
    print("\n📝 Generando archivos PHP...")

    # Participantes
    print("   - participantes_2024.txt")
    with open('participantes_2024.txt', 'w', encoding='utf-8') as f:
        f.write("// Copiar este array en Evento2024Seeder.php\n")
        f.write("// Reemplazar $participantes2024 (si deseas actualizar)\n\n")
        columnas = ['id', 'nombre', 'numero_telefonico', 'direccion', 'id_tipo', 'id_departamento', 'id_municipio', 'pais', 'id_aso', 'fecha_creacion', 'fecha_actualizacion', 'id_usuario']
        f.write(generar_array_php(participantes, 'participantes2024', columnas))

    # Orquídeas
    print("   - orquideas_2024.txt")
    with open('orquideas_2024.txt', 'w', encoding='utf-8') as f:
        f.write("// Copiar este array en Evento2024Seeder.php\n")
        f.write("// Reemplazar $orquideasMuestra con $orquideas2024\n\n")
        columnas = ['id', 'nombre_planta', 'origen', 'foto', 'id_grupo', 'id_clase', 'qr_code', 'codigo', 'id_participante', 'fecha_creacion', 'fecha_actualizacion']
        f.write(generar_array_php(orquideas, 'orquideas2024', columnas))

    # Inscripciones
    print("   - inscripciones_2024.txt")
    with open('inscripciones_2024.txt', 'w', encoding='utf-8') as f:
        f.write("// Copiar este array en Evento2024Seeder.php\n")
        f.write("// Reemplazar $inscripcionesMuestra con $inscripciones2024\n\n")
        columnas = ['id', 'id_participante', 'id_orquidea', 'correlativo']
        f.write(generar_array_php(inscripciones, 'inscripciones2024', columnas))

    # Ganadores
    print("   - ganadores_2024.txt")
    with open('ganadores_2024.txt', 'w', encoding='utf-8') as f:
        f.write("// Copiar este array en Evento2024Seeder.php\n")
        f.write("// Reemplazar $ganadoresMuestra con $ganadores2024\n\n")
        columnas = ['id', 'id_orquidea', 'id_grupo', 'id_clase', 'posicion', 'empate', 'fecha_ganador']
        f.write(generar_array_php(ganadores, 'ganadores2024', columnas))

    print("\n✅ Proceso completado!")
    print("\n📋 Archivos generados:")
    print("   - participantes_2024.txt")
    print("   - orquideas_2024.txt")
    print("   - inscripciones_2024.txt")
    print("   - ganadores_2024.txt")
    print("\n📝 Siguiente paso:")
    print("   1. Abrir cada archivo .txt")
    print("   2. Copiar el contenido")
    print("   3. Pegar en Evento2024Seeder.php en los métodos correspondientes")
    print("   4. Ejecutar: php artisan db:seed --class=Evento2024Seeder")

if __name__ == '__main__':
    main()

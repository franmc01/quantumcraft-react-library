#!/bin/bash

# Verificar que el script reciba un argumento
if [ "$#" -ne 1 ]; then
    echo "Uso: $0 <directorio>"
    exit 1
fi

# Cambiar al directorio proporcionado como argumento
cd "$1" || exit

# Iterar a través de todos los archivos TypeScript (*.ts) en el directorio actual
for file in *.ts
do
    # Si el archivo no es "index.ts" ni un directorio
    if [[ "$file" != "index.ts" ]] && [[ ! -d "$file" ]]
    then
        # Obtener el nombre del archivo sin la extensión
        dir_name="${file%.*}"

        # Verificar que el directorio no existe ya
        if [[ ! -d "$dir_name" ]]
        then
            # Crear un nuevo directorio con el nombre del archivo
            mkdir "$dir_name"
        fi

        # Mover el archivo al nuevo directorio y renombrarlo a "index.ts"
        mv "$file" "$dir_name/index.ts"
    fi
done

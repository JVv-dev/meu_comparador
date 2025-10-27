import csv
import random
from datetime import datetime, timedelta

# Dados fixos dos produtos
produtos = [
    {
        "modelo": "RX 6600",
        "nome": "Placa de Vídeo RX 6600 CLD 8G ASRock AMD Radeon, 8GB, GDDR6  - 90-GA2RZZ-00UANF",
        "preco_base": 1499.99,
        "imagem": "https://images4.kabum.com.br/produtos/fotos/235984/placa-de-video-asrock-amd-radeon-rx-6600-cld-8g-8gb-90-ga2rzz-00uanf_1634738812_gg.jpg",
        "loja": "Kabum",
        "link": "https://www.kabum.com.br/produto/235984/placa-de-video-rx-6600-cld-8g-asrock-amd-radeon-8gb-gddr6-90-ga2rzz-00uanf"
    },
    {
        "modelo": "RX 6600",
        "nome": "Placa de Video ASRock Radeon RX 6600 Challenger D, 8GB, GDDR6, 128-Bit, 90-GA2RZZ-00UANF",
        "preco_base": 1499.99,
        "imagem": "https://media.pichau.com.br/media/catalog/product/cache/2f958555330323e505eba7ce930bdf27/r/x/rx6600-cld-8g3.jpg",
        "loja": "Pichau",
        "link": "https://pichau.com.br/placa-de-video-asrock-radeon-rx-6600-challenger-d-8gb-gddr6-128-bit-90-ga2rzz-00uanf"
    },
    {
        "modelo": "RX 6600",
        "nome": "Placa de Vídeo ASRock Radeon RX 6600 Challenger D, 8GB, GDDR6, FSR, Ray Tracing, 90-GA2RZZ-00UANF",
        "preco_base": 1499.90,
        "imagem": "https://img.terabyteshop.com.br/produto/g/placa-de-video-asrock-radeon-rx-6600-challenger-d-8gb-gddr6-fsr-ray-tracing-90-ga2rzz-00uanf_133352.jpg",
        "loja": "Terabyte",
        "link": "https://www.terabyteshop.com.br/produto/19808/placa-de-video-asrock-radeon-rx-6600-challenger-d-8gb-gddr6-fsr-ray-tracing-90-ga2rzz-00uanf"
    },
    {
        "modelo": "RTX 4070",
        "nome": "Placa De Vídeo Zotac Gaming, Geforce Rtx 4070 Twin Edge, 12GB, Gddr6x - ZT-D40700E-10M",
        "preco_base": 4599.90,
        "imagem": "https://images9.kabum.com.br/produtos/fotos/sync_mirakl/461699/xlarge/Placa-De-V-deo-Zotac-Gaming-Geforce-Rtx-4070-Twin-Edge-12GB-Gddr6x-ZT-D40700E-10M_1758387274.jpg",
        "loja": "Kabum",
        "link": "https://www.kabum.com.br/produto/461699/placa-de-video-rtx-4070-windforce-oc-gigabyte-geforce-12gb-gddr6x-dlss-ray-tracing-gv-n4070wf3oc-12gd"
    },
    {
        "modelo": "RTX 4070",
        "nome": "Placa De Video Gigabyte GeForce RTX 4070 Super Windforce OC, 12GB, GDDR6X, 192-bit, GV-N407SWF3OC-12GD",
        "preco_base": 4699.99,
        "imagem": "https://media.pichau.com.br/media/catalog/product/cache/2f958555330323e505eba7ce930bdf27/g/v/gv-n407swf3oc-12gd2.jpg",
        "loja": "Pichau",
        "link": "https://pichau.com.br/placa-de-video-gigabyte-geforce-rtx-4070-super-windforce-oc-12gb-gddr6x-192-bit-gv-n407swf3oc-12gd"
    },
    {
        "modelo": "RTX 4070",
        "nome": "Placa De Video Gigabyte GeForce RTX 4070 Eagle OC, 12GB, GDDR6X, DLSS, Ray Tracing, GV-N4070EAGLE OC-12GD",
        "preco_base": 0.0,
        "imagem": "https://img.terabyteshop.com.br/produto/g/placa-de-video-gigabyte-geforce-rtx-4070-eagle-oc-12gb-gddr6x-dlss-ray-tracing-gv-n4070eagle-oc-12gd_166417.jpg",
        "loja": "Terabyte",
        "link": "https://www.terabyteshop.com.br/produto/24479/placa-de-video-gigabyte-geforce-rtx-4070-eagle-oc-12gb-gddr6x-dlss-ray-tracing-gv-n4070eagle-oc-12gd"
    }
]

# Gera 50 datas simuladas em 2025
datas = []
inicio = datetime(2025, 8, 27, 9, 12, 14)
for _ in range(50):
    delta_dias = random.randint(0, 10)
    delta_horas = random.randint(0, 23)
    delta_minutos = random.randint(0, 59)
    delta_segundos = random.randint(0, 59)
    delta_microsegundos = random.randint(100000, 900000)
    datas.append(inicio + timedelta(days=delta_dias, hours=delta_horas, minutes=delta_minutos, seconds=delta_segundos, microseconds=delta_microsegundos))

# Cria o CSV
with open("simulacao_placas_detalhada.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f, delimiter=';')
    for data in datas:
        for p in produtos:
            preco_var = round(p["preco_base"] * random.uniform(0.97, 1.03), 2)
            writer.writerow([
                data,
                p["modelo"],
                p["nome"],
                preco_var,
                p["imagem"],
                p["loja"],
                p["link"]
            ])

print("Arquivo 'simulacao_placas_detalhada.csv' gerado com sucesso!")

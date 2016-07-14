# Rio Bus | Heat map 🔥 🚌

Mapa de calor da concentração dos ônibus no Rio de Janeiro utilizando os dados históricos do [Rio Bus](https://github.com/riobus).


## Executando

Após obter os dados, basta abrir a página `index.html` com os parâmetros na URL. 

Exemplo: `index.html?file=results20160708.js&maxIntensity=300`.


parâmetro | descrição				 | exemplo
--------- | ----------------------	 | ---------
**file** | 💾 Nome do arquivo contendo os dados | *results20160708.js*
**maxIntensity** | 🚥 Threshold máximo para as cores | *300*


## Dados

Os dados são exportados através da plataforma de relatórios do Rio Bus, cujos dados são obtidos pelos Dados Abertos Governamentais oferecidos pelo [data.rio](http://data.rio).

Consulta: 

```sql
SELECT ROUND(latitude, 4) AS lat,
       ROUND(longitude, 4) AS long,
       EXACT_COUNT_DISTINCT(ordem) AS amostra
FROM [onibus.gps_current]
WHERE ABS(latitude - (-22.9035)) < 0.5
  AND ABS(longitude - (-43.2096)) < 0.5
  AND DAY(datahora) == DAY(CTIMESTAMP('2016-07-08 12:00:00'))
GROUP BY lat, long
```
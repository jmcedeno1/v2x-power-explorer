UPDATE public.pilots SET
  description = $md$## Overview
Project Sciurus was, at completion, the world's largest domestic vehicle-to-grid (V2G) trial. Between 2018 and 2021 it deployed over 320 Indra V2G chargers into private UK homes, coupling Nissan LEAF and e-NV200 vehicles with the Kaluza smart-charging platform. The £9.8M project was led by OVO Energy with Cenex and Indra, and co-funded by the UK Government's Office for Zero Emission Vehicles (OZEV) and Innovate UK.

## Objectives
Sciurus set out to demonstrate that residential V2G could (i) deliver meaningful revenue and bill savings to EV owners, (ii) provide flexible capacity and balancing services to National Grid ESO, and (iii) do so without harming vehicle batteries or the customer experience.

## Deployment
Chargers were installed in customer homes across Great Britain, with clusters in the South West, London, the Midlands and Scotland. Each charger was a 6 kW bidirectional DC unit using the CHAdeMO V2G protocol, controlled remotely by Kaluza's cloud platform, which optimised charge/discharge against day-ahead prices, imbalance signals and grid services.

## Results
Analysis by Cenex and Imperial College showed average annual customer savings of around £420, with the most engaged users earning over £725 per year. The fleet delivered flexibility equivalent to a small peaking plant. Independent battery testing found no evidence of accelerated degradation from V2G cycling over the trial period.

## Legacy
Sciurus produced the reference UK data set on residential V2G economics, customer behaviour and battery health. Its findings underpin OVO/Kaluza's ongoing commercial V2G proposition and shaped Ofgem and BEIS thinking on smart-tariff and G98/G99 treatment of bidirectional home chargers.$md$,
  power_kw = 1920,
  fleet_size = 320,
  investment_usd = 12500000,
  start_date = '2018-01-01',
  end_date = '2021-12-31',
  partners = ARRAY['OVO Energy','Kaluza','Cenex','Indra','Nissan','Western Power Distribution','National Grid ESO','Innovate UK','OZEV (BEIS)'],
  v2x_type = ARRAY['V2G','V2H'],
  status = 'completed',
  country = 'United Kingdom',
  location = 'United Kingdom (Bristol, London, Midlands, Scotland)',
  image_url = NULL,
  updated_at = now()
WHERE name = 'Project Sciurus';
UPDATE public.pilots SET
  location = 'Tokyo Metropolitan Area',
  country = 'Japan',
  status = 'active',
  power_kw = 630,
  fleet_size = 59,
  start_date = '2019-04-01',
  end_date = NULL,
  investment_usd = NULL,
  partners = ARRAY['TEPCO Holdings','Nissan','Mitsubishi Motors','Nuvve','CHAdeMO Association'],
  v2x_type = ARRAY['V2G','V2B','Frequency regulation','Demand response'],
  gap_categories = ARRAY['Standards','Business model','Metering','TSO-DSO signalling','User acceptance'],
  image_url = '/__l5e/assets-v1/d1f0eb13-5a02-4d08-a5f1-2e7e597a777e/tepco-v2g-leaf.jpg',
  description = $$## Overview
The TEPCO V2G Aggregator is Japan's flagship utility-led V2G programme, run by Tokyo Electric Power Company Holdings (TEPCO HD) via its retail arm TEPCO Energy Partner. Launched commercially in April 2019, it was the first V2G aggregation service in Japan built on the CHAdeMO bidirectional DC standard.

## Fleet & Infrastructure
59 EVs and PHEVs (Nissan LEAF and Mitsubishi Outlander PHEV) operate across 63 CHAdeMO bidirectional DC chargers at 5 sites in the Tokyo service area, providing roughly 630 kW of aggregated dispatchable flexibility.

## Business Model
TEPCO acts as the aggregator, stacking three revenue streams: (1) wholesale energy arbitrage on the JEPX spot market, (2) balancing / frequency regulation to the TSO under Japan's new capacity and balancing markets, and (3) peak-shaving for commercial and industrial customers. Vehicle owners are compensated through reduced electricity tariffs and per-kWh discharge payments.

## Standards & Technology
Runs on CHAdeMO 2.0 bidirectional DC (10-20 kW per charger). Interoperates with Nissan LEAF and Mitsubishi Outlander PHEV native V2X firmware. TEPCO's aggregator platform issues sub-second dispatch signals to on-site chargers.

## Research Objectives
- Validate CHAdeMO bidirectional as a scalable grid-service asset in a large metropolitan grid.
- Prove revenue stacking across JEPX energy, balancing and demand-response markets.
- Feed lessons into METI's regulatory framework for V2G aggregation and Japan's 2030 balancing market design.

## Expected Outcomes
Blueprint for utility-owned V2G aggregation across Japan's 10 regional utilities, plus reference architecture for CHAdeMO V2G exports to other CHAdeMO markets (Europe, Nordics).$$
WHERE name = 'TEPCO V2G Aggregator';
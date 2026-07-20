UPDATE public.pilots SET
  description = 'Master''s thesis research (Memorial University of Newfoundland, July 2021) by Raghul Suraj Sundararajan designing a residential V2H/V2G energy system tailored to Newfoundland climate conditions. The work uses a Nissan Leaf as the bidirectional EV and Mozilla IoT (WebThings) as the control/monitoring platform. Delivered across four phases: (1) dynamic modelling of a solar + V2H system, (2) dynamic modelling of a solar + V2G system, (3) IoT-based solar + V2H design, and (4) a hardware prototype demonstrating eight operating modes with interoperability and security considerations.',
  partners = ARRAY['Memorial University of Newfoundland','Nissan Leaf (EV platform)','Mozilla IoT / WebThings'],
  v2x_type = ARRAY['V2H','V2G'],
  location = 'St. John''s, Newfoundland',
  start_date = '2019-09-01',
  end_date = '2021-07-31',
  fleet_size = 1,
  gap_categories = ARRAY['residential-scale prototype','cold-climate validation','IoT security'],
  updated_at = now()
WHERE name = '13 Polina Road, St. John''s, Newfoundland V2H solar system';
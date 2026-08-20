// Top 5 most-cited publications per growing topic.
// Snapshot from the documents corpus (OpenAlex), filtered to bidirectional/V2G relevance.

export type TopPaper = {
  title: string;
  doi?: string;
  year?: number;
  citations: number;
};

export const PUBLICATION_TOP_PAPERS: Record<string, TopPaper[]> = {
  'Energy Management Systems (EMS/HEMS)': [
    { title: 'Smart Household Operation Considering Bi-Directional EV and ESS Utilization by Real-Time Pricing-Based DR', doi: '10.1109/tsg.2014.2352650', year: 2014, citations: 463 },
    { title: 'Stochastic Optimal Energy Management of Smart Home With PEV Energy Storage', doi: '10.1109/tsg.2016.2606442', year: 2016, citations: 304 },
    { title: 'Integrated PV Charging of EV Fleet Based on Energy Prices, V2G, and Offer of Reserves', doi: '10.1109/tsg.2017.2763683', year: 2017, citations: 262 },
    { title: 'Reinforcement Learning Based Energy Management Algorithm for Smart Energy Buildings', doi: '10.3390/en11082010', year: 2018, citations: 165 },
    { title: 'OCPP Protocol: Security Threats and Challenges', doi: '10.1109/tsg.2017.2669647', year: 2017, citations: 157 },
  ],
  'V2G Policy & Regulation': [
    { title: 'Electricity market design for the prosumer era', doi: '10.1038/nenergy.2016.32', year: 2016, citations: 1219 },
    { title: 'Development of an Optimal Vehicle-to-Grid Aggregator for Frequency Regulation', doi: '10.1109/tsg.2010.2045163', year: 2010, citations: 1085 },
    { title: 'Review of the Impact of Vehicle-to-Grid Technologies on Distribution Systems and Utility Interfaces', doi: '10.1109/tpel.2012.2227500', year: 2012, citations: 991 },
    { title: 'A Survey on the Electrification of Transportation in a Smart Grid Environment', doi: '10.1109/tii.2011.2172454', year: 2011, citations: 810 },
    { title: 'Optimal Charging Strategies for Unidirectional Vehicle-to-Grid', doi: '10.1109/tsg.2010.2090910', year: 2010, citations: 748 },
  ],
  'V2G Field Trials & Pilots': [
    { title: 'Smart charging of electric vehicles with photovoltaic power and vehicle-to-grid technology in a microgrid; a case study', doi: '10.1016/j.apenergy.2015.04.092', year: 2015, citations: 334 },
    { title: 'Integrating a hydrogen fuel cell electric vehicle with vehicle-to-grid technology, photovoltaic power and a residential building', doi: '10.1016/j.apenergy.2018.02.038', year: 2018, citations: 271 },
    { title: 'Examination of a PHEV bidirectional charger system for V2G reactive power compensation', doi: '10.1109/apec.2010.5433629', year: 2010, citations: 266 },
    { title: 'Vehicle-to-Grid Regulation Reserves Based on a Dynamic Simulation of Mobility Behavior', doi: '10.1109/tsg.2011.2131692', year: 2011, citations: 256 },
    { title: 'On the possibility of extending the lifetime of lithium-ion batteries through optimal V2G facilitated by an integrated vehicle and smart-grid system', doi: '10.1016/j.energy.2017.04.116', year: 2017, citations: 239 },
  ],
  'Renewable Integration & Solar+EV': [
    { title: 'Electricity market design for the prosumer era', doi: '10.1038/nenergy.2016.32', year: 2016, citations: 1219 },
    { title: 'Plug-in Vehicles and Renewable Energy Sources for Cost and Emission Reductions', doi: '10.1109/tie.2010.2047828', year: 2010, citations: 852 },
    { title: 'Optimized Operational Cost Reduction for an EV Charging Station Integrated With Battery Energy Storage and PV Generation', doi: '10.1109/tsg.2017.2788440', year: 2018, citations: 442 },
    { title: 'Smart charging of electric vehicles with photovoltaic power and vehicle-to-grid technology in a microgrid; a case study', doi: '10.1016/j.apenergy.2015.04.092', year: 2015, citations: 334 },
    { title: 'Real-Time Energy Management Algorithm for Plug-In Hybrid Electric Vehicle Charging Parks Involving Sustainable Energy', doi: '10.1109/tste.2013.2278544', year: 2013, citations: 318 },
  ],
  'V2G Environmental & LCA': [
    { title: 'Plug-in Vehicles and Renewable Energy Sources for Cost and Emission Reductions', doi: '10.1109/tie.2010.2047828', year: 2010, citations: 852 },
    { title: 'Optimal location of electric vehicle charging station and its impact on distribution network: A review', doi: '10.1016/j.egyr.2022.01.180', year: 2022, citations: 465 },
    { title: 'A review on barrier and challenges of electric vehicle in India and vehicle to grid optimisation', doi: '10.1016/j.treng.2021.100057', year: 2021, citations: 370 },
    { title: 'Resource Scheduling Under Uncertainty in a Smart Grid With Renewables and Plug-in Vehicles', doi: '10.1109/jsyst.2011.2163012', year: 2011, citations: 310 },
    { title: 'Modeling the Benefits of Vehicle-to-Grid Technology to a Power System', doi: '10.1109/tpwrs.2011.2178043', year: 2012, citations: 275 },
  ],
  'V2G with Renewables & Solar': [
    { title: 'Electricity market design for the prosumer era', doi: '10.1038/nenergy.2016.32', year: 2016, citations: 1219 },
    { title: 'Plug-in Vehicles and Renewable Energy Sources for Cost and Emission Reductions', doi: '10.1109/tie.2010.2047828', year: 2010, citations: 852 },
    { title: 'Decentralized Vehicle-to-Grid Control for Primary Frequency Regulation Considering Charging Demands', doi: '10.1109/tpwrs.2013.2252029', year: 2013, citations: 479 },
    { title: 'Optimized Operational Cost Reduction for an EV Charging Station Integrated With Battery Energy Storage and PV Generation', doi: '10.1109/tsg.2017.2788440', year: 2018, citations: 442 },
    { title: 'Hourly Coordination of Electric Vehicle Operation and Volatile Wind Power Generation in SCUC', doi: '10.1109/tsg.2012.2186642', year: 2012, citations: 387 },
  ],
  'V2G Optimal Scheduling & Bidding': [
    { title: 'Review of the Impact of Vehicle-to-Grid Technologies on Distribution Systems and Utility Interfaces', doi: '10.1109/tpel.2012.2227500', year: 2012, citations: 991 },
    { title: 'Plug-in Vehicles and Renewable Energy Sources for Cost and Emission Reductions', doi: '10.1109/tie.2010.2047828', year: 2010, citations: 852 },
    { title: 'Optimal Scheduling of Vehicle-to-Grid Energy and Ancillary Services', doi: '10.1109/tsg.2011.2164099', year: 2011, citations: 697 },
    { title: 'Optimal location of electric vehicle charging station and its impact on distribution network: A review', doi: '10.1016/j.egyr.2022.01.180', year: 2022, citations: 465 },
    { title: 'A Review of Charge Scheduling of Electric Vehicles in Smart Grid', doi: '10.1109/jsyst.2014.2356559', year: 2014, citations: 400 },
  ],
  'V2G Simulation & Modeling': [
    { title: 'Development of an Optimal Vehicle-to-Grid Aggregator for Frequency Regulation', doi: '10.1109/tsg.2010.2045163', year: 2010, citations: 1085 },
    { title: 'A Bidirectional Inductive Power Interface for Electric Vehicles in V2G Systems', doi: '10.1109/tie.2011.2114312', year: 2011, citations: 795 },
    { title: 'Optimal Charging Strategies for Unidirectional Vehicle-to-Grid', doi: '10.1109/tsg.2010.2090910', year: 2010, citations: 748 },
    { title: 'Optimal Scheduling of Vehicle-to-Grid Energy and Ancillary Services', doi: '10.1109/tsg.2011.2164099', year: 2011, citations: 697 },
    { title: 'Modeling of the Cost of EV Battery Wear Due to V2G Application in Power Systems', doi: '10.1109/tec.2011.2159977', year: 2011, citations: 490 },
  ],
  'V2G Economics & Business Models': [
    { title: 'Vehicle-to-grid power fundamentals: Calculating capacity and net revenue', doi: '10.1016/j.jpowsour.2004.12.025', year: 2005, citations: 2260 },
    { title: 'Real-Time Energy Management Algorithm for Plug-In Hybrid Electric Vehicle Charging Parks Involving Sustainable Energy', doi: '10.1109/tste.2013.2278544', year: 2013, citations: 318 },
    { title: 'Electric Vehicle-to-Grid (V2G) Technologies: Impact on the Power Grid and Battery', doi: '10.3390/su142113856', year: 2022, citations: 265 },
    { title: 'Actors, business models, and innovation activity systems for vehicle-to-grid (V2G) technology: A comprehensive review', doi: '10.1016/j.rser.2020.109963', year: 2020, citations: 256 },
    { title: 'The viability of vehicle-to-grid operations from a battery technology and policy perspective', doi: '10.1016/j.enpol.2017.11.015', year: 2017, citations: 225 },
  ],
  'EV Charging Infrastructure': [
    { title: 'Review of Battery Charger Topologies, Charging Power Levels, and Infrastructure for Plug-In Electric and Hybrid Vehicles', doi: '10.1109/tpel.2012.2212917', year: 2012, citations: 3025 },
    { title: 'Review of the Impact of Vehicle-to-Grid Technologies on Distribution Systems and Utility Interfaces', doi: '10.1109/tpel.2012.2227500', year: 2012, citations: 991 },
    { title: 'A Comprehensive Review of Wireless Charging Technologies for Electric Vehicles', doi: '10.1109/tte.2017.2771619', year: 2017, citations: 947 },
    { title: 'A Survey on the Electrification of Transportation in a Smart Grid Environment', doi: '10.1109/tii.2011.2172454', year: 2011, citations: 810 },
    { title: 'Optimal location of electric vehicle charging station and its impact on distribution network: A review', doi: '10.1016/j.egyr.2022.01.180', year: 2022, citations: 465 },
  ],
};

export function paperLink(p: TopPaper): string {
  if (p.doi) return `https://doi.org/${p.doi}`;
  return `https://www.google.com/search?q=${encodeURIComponent(p.title)}`;
}

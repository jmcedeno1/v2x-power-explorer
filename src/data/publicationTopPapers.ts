// Top 5 most-cited publications per growing topic, restricted to the last 5 years (2021 onward).
// Snapshot from the documents corpus (OpenAlex), filtered to bidirectional/V2G relevance.

export type TopPaper = {
  title: string;
  doi?: string;
  year?: number;
  citations: number;
};

export const PUBLICATION_TOP_PAPERS: Record<string, TopPaper[]> = {
  'Energy Management Systems (EMS/HEMS)': [
    { title: 'A comprehensive review of energy management strategy in Vehicle-to-Grid technology integrated with renewable energy sources', doi: '10.1016/j.seta.2021.101439', year: 2021, citations: 185 },
    { title: 'Demand side management of electric vehicles in smart grids: A survey on strategies, challenges, modeling, and optimization', doi: '10.1016/j.egyr.2022.09.023', year: 2022, citations: 178 },
    { title: 'Placement and Capacity of EV Charging Stations by Considering Uncertainties With Energy Management Strategies', doi: '10.1109/tia.2023.3253817', year: 2023, citations: 112 },
    { title: 'Power System Integration of Electric Vehicles: A Review on Impacts and Contributions to the Smart Grid', doi: '10.3390/app14062246', year: 2024, citations: 107 },
    { title: 'A Dynamic Optimal Scheduling Strategy for Multi-Charging Scenarios of Plug-in-Electric Vehicles Over a Smart Grid', doi: '10.1109/access.2023.3258859', year: 2023, citations: 106 },
  ],
  'V2G Policy & Regulation': [
    { title: 'Electric Vehicle-to-Grid (V2G) Technologies: Impact on the Power Grid and Battery', doi: '10.3390/su142113856', year: 2022, citations: 265 },
    { title: 'Integrating artificial intelligence in energy transition: A comprehensive review', doi: '10.1016/j.esr.2024.101600', year: 2025, citations: 203 },
    { title: 'A Distributed MPC to Exploit Reactive Power V2G for Real-Time Voltage Regulation in Distribution Networks', doi: '10.1109/tsg.2021.3109453', year: 2021, citations: 201 },
    { title: 'A study of charging-dispatch strategies and vehicle-to-grid technologies for electric vehicles in distribution networks', doi: '10.1016/j.egyr.2022.12.139', year: 2023, citations: 187 },
    { title: 'Reaping the Benefits of Smart Electric Vehicle Charging and Vehicle-to-Grid Technologies: Regulatory, Policy and Technical Aspects', doi: '10.1109/access.2022.3217525', year: 2022, citations: 130 },
  ],
  'V2G Field Trials & Pilots': [
    { title: 'A Distributed MPC to Exploit Reactive Power V2G for Real-Time Voltage Regulation in Distribution Networks', doi: '10.1109/tsg.2021.3109453', year: 2021, citations: 201 },
    { title: 'A study of charging-dispatch strategies and vehicle-to-grid technologies for electric vehicles in distribution networks', doi: '10.1016/j.egyr.2022.12.139', year: 2023, citations: 187 },
    { title: 'A Wide-Range High-Voltage-Gain Bidirectional DC-DC Converter for V2G and G2V Hybrid EV Charger', doi: '10.1109/tie.2021.3084181', year: 2021, citations: 183 },
    { title: 'Reinforcement learning for electric vehicle applications in power systems: A critical review', doi: '10.1016/j.rser.2022.113052', year: 2022, citations: 157 },
    { title: 'Vehicle-to-grid impact on battery degradation and estimation of V2G economic compensation', doi: '10.1016/j.apenergy.2024.124546', year: 2024, citations: 143 },
  ],
  'Renewable Integration & Solar+EV': [
    { title: 'A review on barrier and challenges of electric vehicle in India and vehicle to grid optimisation', doi: '10.1016/j.treng.2021.100057', year: 2021, citations: 370 },
    { title: 'Integrating artificial intelligence in energy transition: A comprehensive review', doi: '10.1016/j.esr.2024.101600', year: 2025, citations: 203 },
    { title: 'A comprehensive review of energy management strategy in Vehicle-to-Grid technology integrated with renewable energy sources', doi: '10.1016/j.seta.2021.101439', year: 2021, citations: 185 },
    { title: 'Improving Reliability and Stability of the Power Systems: A Comprehensive Review on the Role of Energy Storage Systems to Enhance Flexibility', doi: '10.1109/access.2024.3476959', year: 2024, citations: 162 },
    { title: 'Reinforcement learning for electric vehicle applications in power systems: A critical review', doi: '10.1016/j.rser.2022.113052', year: 2022, citations: 157 },
  ],
  'V2G Environmental & LCA': [
    { title: 'A review on barrier and challenges of electric vehicle in India and vehicle to grid optimisation', doi: '10.1016/j.treng.2021.100057', year: 2021, citations: 370 },
    { title: 'Utilization of Electric Vehicles for Vehicle-to-Grid Services: Progress and Perspectives', doi: '10.3390/en15020589', year: 2022, citations: 299 },
    { title: 'Integrating artificial intelligence in energy transition: A comprehensive review', doi: '10.1016/j.esr.2024.101600', year: 2025, citations: 203 },
    { title: 'Demand side management of electric vehicles in smart grids: A survey on strategies, challenges, modeling, and optimization', doi: '10.1016/j.egyr.2022.09.023', year: 2022, citations: 178 },
    { title: 'Improving Reliability and Stability of the Power Systems: A Comprehensive Review on the Role of Energy Storage Systems to Enhance Flexibility', doi: '10.1109/access.2024.3476959', year: 2024, citations: 162 },
  ],
  'V2G with Renewables & Solar': [
    { title: 'A review on barrier and challenges of electric vehicle in India and vehicle to grid optimisation', doi: '10.1016/j.treng.2021.100057', year: 2021, citations: 370 },
    { title: 'Integrating artificial intelligence in energy transition: A comprehensive review', doi: '10.1016/j.esr.2024.101600', year: 2025, citations: 203 },
    { title: 'A comprehensive review of energy management strategy in Vehicle-to-Grid technology integrated with renewable energy sources', doi: '10.1016/j.seta.2021.101439', year: 2021, citations: 185 },
    { title: 'Improving Reliability and Stability of the Power Systems: A Comprehensive Review on the Role of Energy Storage Systems to Enhance Flexibility', doi: '10.1109/access.2024.3476959', year: 2024, citations: 162 },
    { title: 'Reinforcement learning for electric vehicle applications in power systems: A critical review', doi: '10.1016/j.rser.2022.113052', year: 2022, citations: 157 },
  ],
  'V2G Optimal Scheduling & Bidding': [
    { title: 'Electric Vehicle-to-Grid (V2G) Technologies: Impact on the Power Grid and Battery', doi: '10.3390/su142113856', year: 2022, citations: 265 },
    { title: 'Integrating artificial intelligence in energy transition: A comprehensive review', doi: '10.1016/j.esr.2024.101600', year: 2025, citations: 203 },
    { title: 'A study of charging-dispatch strategies and vehicle-to-grid technologies for electric vehicles in distribution networks', doi: '10.1016/j.egyr.2022.12.139', year: 2023, citations: 187 },
    { title: 'Demand side management of electric vehicles in smart grids: A survey on strategies, challenges, modeling, and optimization', doi: '10.1016/j.egyr.2022.09.023', year: 2022, citations: 178 },
    { title: 'Improving Reliability and Stability of the Power Systems: A Comprehensive Review on the Role of Energy Storage Systems to Enhance Flexibility', doi: '10.1109/access.2024.3476959', year: 2024, citations: 162 },
  ],
  'V2G Simulation & Modeling': [
    { title: 'A review on barrier and challenges of electric vehicle in India and vehicle to grid optimisation', doi: '10.1016/j.treng.2021.100057', year: 2021, citations: 370 },
    { title: 'Electric Vehicle-to-Grid (V2G) Technologies: Impact on the Power Grid and Battery', doi: '10.3390/su142113856', year: 2022, citations: 265 },
    { title: 'A Distributed MPC to Exploit Reactive Power V2G for Real-Time Voltage Regulation in Distribution Networks', doi: '10.1109/tsg.2021.3109453', year: 2021, citations: 201 },
    { title: 'Demand side management of electric vehicles in smart grids: A survey on strategies, challenges, modeling, and optimization', doi: '10.1016/j.egyr.2022.09.023', year: 2022, citations: 178 },
    { title: 'Electric Vehicle Charging System in the Smart Grid Using Different Machine Learning Methods', doi: '10.3390/su15032603', year: 2023, citations: 172 },
  ],
  'V2G Economics & Business Models': [
    { title: 'Electric Vehicle-to-Grid (V2G) Technologies: Impact on the Power Grid and Battery', doi: '10.3390/su142113856', year: 2022, citations: 265 },
    { title: 'Integrating artificial intelligence in energy transition: A comprehensive review', doi: '10.1016/j.esr.2024.101600', year: 2025, citations: 203 },
    { title: 'Vehicle-to-grid impact on battery degradation and estimation of V2G economic compensation', doi: '10.1016/j.apenergy.2024.124546', year: 2024, citations: 143 },
    { title: 'Reaping the Benefits of Smart Electric Vehicle Charging and Vehicle-to-Grid Technologies: Regulatory, Policy and Technical Aspects', doi: '10.1109/access.2022.3217525', year: 2022, citations: 130 },
    { title: 'Vehicle-to-X (V2X) implementation: An overview of predominate trial configurations and technical, social and regulatory challenges', doi: '10.1016/j.rser.2021.110977', year: 2021, citations: 129 },
  ],
  'EV Charging Infrastructure': [
    { title: 'A review on barrier and challenges of electric vehicle in India and vehicle to grid optimisation', doi: '10.1016/j.treng.2021.100057', year: 2021, citations: 370 },
    { title: 'Utilization of Electric Vehicles for Vehicle-to-Grid Services: Progress and Perspectives', doi: '10.3390/en15020589', year: 2022, citations: 299 },
    { title: 'Electric Vehicle-to-Grid (V2G) Technologies: Impact on the Power Grid and Battery', doi: '10.3390/su142113856', year: 2022, citations: 265 },
    { title: 'A Distributed MPC to Exploit Reactive Power V2G for Real-Time Voltage Regulation in Distribution Networks', doi: '10.1109/tsg.2021.3109453', year: 2021, citations: 201 },
    { title: 'A study of charging-dispatch strategies and vehicle-to-grid technologies for electric vehicles in distribution networks', doi: '10.1016/j.egyr.2022.12.139', year: 2023, citations: 187 },
  ],
};

export function paperLink(p: TopPaper): string {
  if (p.doi) return `https://doi.org/${p.doi}`;
  return `https://www.google.com/search?q=${encodeURIComponent(p.title)}`;
}

import { useState, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════
// DATA — Single source of truth for all SDG information
// Official UN colors, names, sub-targets, and indicators
// ═══════════════════════════════════════════════════════════════════
const SDGS = [
  { id:1,  name:"No Poverty", color:"#e5243b",
    overview:"End poverty in all its forms everywhere by ensuring social protection systems, equal rights to economic resources, and resilience against climate-related and economic shocks.",
    targets:[
      {id:"1.1", year:"2030", text:"Eradicate extreme poverty for all people everywhere, currently measured as people living on less than $1.25 a day"},
      {id:"1.2", year:"2030", text:"Reduce at least by half the proportion of men, women and children of all ages living in poverty in all its dimensions"},
      {id:"1.3", year:null,   text:"Implement nationally appropriate social protection systems and measures for all, including floors, and achieve substantial coverage of the poor and the vulnerable"},
      {id:"1.4", year:"2030", text:"Ensure that all men and women, in particular the poor and the vulnerable, have equal rights to economic resources, as well as access to basic services, ownership and control over land"},
      {id:"1.5", year:"2030", text:"Build the resilience of the poor and those in vulnerable situations and reduce their exposure and vulnerability to climate-related extreme events and other economic, social and environmental shocks"},
      {id:"1.a", year:null,   text:"Ensure significant mobilization of resources from a variety of sources to provide adequate and predictable means for developing countries to implement programmes and policies to end poverty"},
      {id:"1.b", year:null,   text:"Create sound policy frameworks at the national, regional and international levels, based on pro-poor and gender-sensitive development strategies"},
    ],
    indicators:["1.1.1 Proportion of population below international poverty line (%)","1.2.1 Proportion of population living below national poverty line (%)","1.2.2 Proportion of men, women and children living in poverty in all its dimensions","1.3.1 Proportion of population covered by social protection floors/systems","1.4.1 Proportion with access to basic services","1.4.2 Proportion with secure tenure rights to land","1.5.1 Number of deaths, missing persons and persons affected by disaster per 100,000","1.5.2 Direct economic loss attributed to disasters relative to GDP","1.5.3 Countries with national DRR strategies aligned with Sendai Framework","1.a.1 Total official development assistance grants for poverty reduction","1.b.1 Pro-poor public social spending"] },

  { id:2,  name:"Zero Hunger", color:"#dda63a",
    overview:"End hunger, achieve food security and improved nutrition, and promote sustainable agriculture through fair food systems, reduced food loss, and investment in rural infrastructure.",
    targets:[
      {id:"2.1", year:"2030", text:"End hunger and ensure access by all people, in particular the poor and people in vulnerable situations, including infants, to safe, nutritious and sufficient food all year round"},
      {id:"2.2", year:"2030", text:"End all forms of malnutrition, including achieving by 2025 internationally agreed targets on stunting and wasting in children under 5"},
      {id:"2.3", year:"2030", text:"Double the agricultural productivity and incomes of small-scale food producers, in particular women, indigenous peoples, family farmers, pastoralists and fishers"},
      {id:"2.4", year:"2030", text:"Ensure sustainable food production systems and implement resilient agricultural practices that increase productivity and production"},
      {id:"2.5", year:"2020", text:"Maintain the genetic diversity of seeds, cultivated plants and farmed and domesticated animals and their related wild species"},
      {id:"2.a", year:null,   text:"Increase investment, including via enhanced international cooperation, in rural infrastructure, agricultural research and extension services"},
      {id:"2.b", year:null,   text:"Correct and prevent trade restrictions and distortions in world agricultural markets"},
      {id:"2.c", year:null,   text:"Adopt measures to ensure the proper functioning of food commodity markets and their derivatives"},
    ],
    indicators:["2.1.1 Prevalence of undernourishment (%)","2.1.2 Prevalence of moderate or severe food insecurity","2.2.1 Prevalence of stunting among children under 5 (%)","2.2.2 Prevalence of malnutrition among children under 5","2.2.3 Prevalence of anaemia in women 15–49 years (%)","2.3.1 Volume of production per labour unit by size of farming/pastoral enterprise","2.3.2 Average income of small-scale food producers","2.4.1 Proportion of agricultural area under productive and sustainable agriculture","2.5.1 Number of plant and animal genetic resources secured","2.5.2 Proportion of local breeds classified as at risk","2.a.1 Agriculture orientation index for government expenditures","2.b.1 Agricultural export subsidies"] },

  { id:3,  name:"Good Health & Well-Being", color:"#4c9f38",
    overview:"Ensure healthy lives and promote well-being for all at all ages by reducing mortality, combating diseases, achieving universal health coverage, and reducing health risks from environmental and chemical pollution.",
    targets:[
      {id:"3.1", year:"2030", text:"Reduce the global maternal mortality ratio to less than 70 per 100,000 live births"},
      {id:"3.2", year:"2030", text:"End preventable deaths of newborns and children under 5 years of age"},
      {id:"3.3", year:"2030", text:"End the epidemics of AIDS, tuberculosis, malaria and neglected tropical diseases"},
      {id:"3.4", year:"2030", text:"Reduce by one third premature mortality from non-communicable diseases through prevention and treatment"},
      {id:"3.5", year:null,   text:"Strengthen the prevention and treatment of substance abuse, including narcotic drug abuse and harmful use of alcohol"},
      {id:"3.6", year:"2020", text:"Halve the number of global deaths and injuries from road traffic accidents"},
      {id:"3.7", year:"2030", text:"Ensure universal access to sexual and reproductive health-care services"},
      {id:"3.8", year:null,   text:"Achieve universal health coverage, including financial risk protection and access to quality essential health-care services"},
      {id:"3.9", year:"2030", text:"Substantially reduce the number of deaths and illnesses from hazardous chemicals and air, water and soil pollution and contamination"},
      {id:"3.a", year:null,   text:"Strengthen the implementation of the WHO Framework Convention on Tobacco Control"},
      {id:"3.b", year:null,   text:"Support the research and development of vaccines and medicines for communicable and non-communicable diseases"},
      {id:"3.c", year:null,   text:"Substantially increase health financing and the recruitment, development, training and retention of the health workforce in developing countries"},
      {id:"3.d", year:null,   text:"Strengthen the capacity of all countries for early warning, risk reduction and management of national and global health risks"},
    ],
    indicators:["3.1.1 Maternal mortality ratio","3.1.2 Proportion of births attended by skilled health personnel","3.2.1 Under-5 mortality rate","3.2.2 Neonatal mortality rate","3.3.1 Number of new HIV infections per 1,000 uninfected population","3.3.2 Tuberculosis incidence per 100,000 population","3.3.3 Malaria incidence per 1,000 population","3.3.4 Hepatitis B incidence per 100,000 population","3.4.1 Mortality rate from cardiovascular disease, cancer, diabetes or chronic respiratory disease","3.4.2 Suicide mortality rate","3.5.2 Alcohol per capita consumption (litres of pure alcohol)","3.6.1 Death rate from road traffic injuries","3.7.1 Proportion of women who have their need for family planning satisfied","3.8.1 Coverage of essential health services","3.8.2 Proportion with large household expenditure on health as share of total expenditure","3.9.1 Mortality rate from household and ambient air pollution","3.9.2 Mortality rate from unsafe water, sanitation and hygiene","3.9.3 Mortality rate from unintentional poisoning","3.b.1 Proportion of the population with access to affordable medicines","3.c.1 Health worker density and distribution"] },

  { id:4,  name:"Quality Education", color:"#c5192d",
    overview:"Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all, with focus on access, completion rates, digital literacy, and eliminating gender and income disparities.",
    targets:[
      {id:"4.1", year:"2030", text:"Ensure that all girls and boys complete free, equitable and quality primary and secondary education"},
      {id:"4.2", year:"2030", text:"Ensure that all girls and boys have access to quality early childhood development, care and pre-primary education"},
      {id:"4.3", year:"2030", text:"Ensure equal access for all women and men to affordable and quality technical, vocational and tertiary education"},
      {id:"4.4", year:"2030", text:"Substantially increase the number of youth and adults who have relevant skills, including technical and vocational skills, for employment"},
      {id:"4.5", year:"2030", text:"Eliminate gender disparities in education and ensure equal access to all levels of education for the vulnerable"},
      {id:"4.6", year:"2030", text:"Ensure that all youth and a substantial proportion of adults, both men and women, achieve literacy and numeracy"},
      {id:"4.7", year:"2030", text:"Ensure that all learners acquire the knowledge and skills needed to promote sustainable development"},
      {id:"4.a", year:null,   text:"Build and upgrade education facilities that are child, disability and gender sensitive and provide safe, non-violent, inclusive and effective learning environments"},
      {id:"4.b", year:"2020", text:"Substantially expand globally the number of scholarships available to developing countries"},
      {id:"4.c", year:"2030", text:"Substantially increase the supply of qualified teachers, including through international cooperation"},
    ],
    indicators:["4.1.1 Proportion achieving minimum proficiency in reading and mathematics","4.1.2 Completion rate (primary, lower secondary, upper secondary)","4.2.1 Proportion in organized learning one year before official primary entry age","4.2.2 Participation rate in organized learning (administrative data)","4.3.1 Participation rate of youth and adults in formal and non-formal education and training","4.4.1 Proportion of youth/adults with ICT skills","4.5.1 Parity indices for all education indicators","4.6.1 Proportion achieving fixed level of proficiency in literacy and numeracy","4.7.1 Extent to which global citizenship and sustainability are mainstreamed in education","4.a.1 Proportion of schools with access to electricity, internet, computers, etc.","4.b.1 Volume of ODA flows for scholarships","4.c.1 Proportion of teachers with minimum required qualifications"] },

  { id:5,  name:"Gender Equality", color:"#ff3a21",
    overview:"Achieve gender equality and empower all women and girls by eliminating discrimination, violence, and harmful practices, and ensuring equal participation in leadership and economic life.",
    targets:[
      {id:"5.1", year:null,   text:"End all forms of discrimination against all women and girls everywhere"},
      {id:"5.2", year:null,   text:"Eliminate all forms of violence against all women and girls in public and private spheres"},
      {id:"5.3", year:null,   text:"Eliminate all harmful practices, such as child, early and forced marriage and female genital mutilation"},
      {id:"5.4", year:null,   text:"Recognize and value unpaid care and domestic work through the provision of public services and social protection policies"},
      {id:"5.5", year:null,   text:"Ensure women's full and effective participation and equal opportunities for leadership at all levels"},
      {id:"5.6", year:null,   text:"Ensure universal access to sexual and reproductive health and reproductive rights"},
      {id:"5.a", year:null,   text:"Undertake reforms to give women equal rights to economic resources, as well as access to ownership and control over land"},
      {id:"5.b", year:null,   text:"Enhance the use of enabling technology, in particular information and communications technology, to promote the empowerment of women"},
      {id:"5.c", year:null,   text:"Adopt and strengthen sound policies and enforceable legislation for the promotion of gender equality and the empowerment of all women and girls"},
    ],
    indicators:["5.1.1 Countries with legal frameworks for gender equality","5.2.1 Proportion of ever-partnered women subjected to physical/sexual violence by current/former intimate partner","5.2.2 Proportion of women/girls subjected to sexual violence by non-partners","5.3.1 Proportion of women aged 20–24 who were married before age 18","5.3.2 Proportion of girls/women who have undergone female genital mutilation","5.4.1 Proportion of time spent on unpaid domestic and care work","5.5.1 Proportion of seats held by women in parliaments and local governments","5.5.2 Proportion of women in managerial positions","5.6.1 Proportion of women aged 15–49 who make their own informed decisions","5.a.1 Countries guaranteeing women equal rights to land ownership","5.b.1 Proportion of individuals who own a mobile telephone, by sex","5.c.1 Countries with systems to track and make public allocations for gender equality"] },

  { id:6,  name:"Clean Water & Sanitation", color:"#26bde2",
    overview:"Ensure availability and sustainable management of water and sanitation for all, including safe drinking water, adequate sanitation, improved water quality, and protection of water-related ecosystems.",
    targets:[
      {id:"6.1", year:"2030", text:"Achieve universal and equitable access to safe and affordable drinking water for all"},
      {id:"6.2", year:"2030", text:"Achieve access to adequate and equitable sanitation and hygiene for all and end open defecation"},
      {id:"6.3", year:"2030", text:"Improve water quality by reducing pollution, eliminating dumping and minimizing release of hazardous chemicals and materials"},
      {id:"6.4", year:"2030", text:"Substantially increase water-use efficiency across all sectors and ensure sustainable withdrawals"},
      {id:"6.5", year:"2030", text:"Implement integrated water resources management at all levels, including through transboundary cooperation"},
      {id:"6.6", year:"2020", text:"Protect and restore water-related ecosystems, including mountains, forests, wetlands, rivers, aquifers and lakes"},
      {id:"6.a", year:null,   text:"Expand international cooperation and capacity-building support to developing countries in water and sanitation activities"},
      {id:"6.b", year:null,   text:"Support and strengthen the participation of local communities in improving water and sanitation management"},
    ],
    indicators:["6.1.1 Proportion using safely managed drinking water services","6.2.1 Proportion using safely managed sanitation services","6.3.1 Proportion of wastewater safely treated","6.3.2 Proportion of bodies of water with good ambient water quality","6.4.1 Change in water-use efficiency over time","6.4.2 Level of water stress: freshwater withdrawal as a proportion of available freshwater resources","6.5.1 Degree of integrated water resources management","6.5.2 Proportion of transboundary basin area with operational arrangement","6.6.1 Change in the extent of water-related ecosystems over time","6.a.1 Amount of water and sanitation-related ODA","6.b.1 Proportion of local administrative units with established policies for participation"] },

  { id:7,  name:"Affordable & Clean Energy", color:"#fcc30b",
    overview:"Ensure access to affordable, reliable, sustainable and modern energy for all by expanding renewable energy, improving efficiency, and facilitating clean energy technology transfer to developing countries.",
    targets:[
      {id:"7.1", year:"2030", text:"Ensure universal access to affordable, reliable and modern energy services"},
      {id:"7.2", year:"2030", text:"Increase substantially the share of renewable energy in the global energy mix"},
      {id:"7.3", year:"2030", text:"Double the global rate of improvement in energy efficiency"},
      {id:"7.a", year:"2030", text:"Enhance international cooperation to facilitate access to clean energy research and technology, including renewable energy, energy efficiency"},
      {id:"7.b", year:"2030", text:"Expand infrastructure and upgrade technology for supplying modern and sustainable energy services for all in developing countries"},
    ],
    indicators:["7.1.1 Proportion of population with access to electricity","7.1.2 Proportion of population with primary reliance on clean fuels and technology","7.2.1 Renewable energy share in the total final energy consumption (%)","7.3.1 Energy intensity measured in terms of primary energy and GDP","7.a.1 International financial flows to developing countries in support of clean and renewable energy","7.b.1 Installed renewable energy-generating capacity in developing countries"] },

  { id:8,  name:"Decent Work & Economic Growth", color:"#a21942",
    overview:"Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all, while decoupling growth from environmental degradation.",
    targets:[
      {id:"8.1", year:null,   text:"Sustain per capita economic growth in accordance with national circumstances, at least 7% GDP growth per annum in LDCs"},
      {id:"8.2", year:null,   text:"Achieve higher levels of economic productivity through diversification, technological upgrading and innovation"},
      {id:"8.3", year:null,   text:"Promote development-oriented policies that support productive activities, decent job creation, entrepreneurship, creativity and innovation"},
      {id:"8.4", year:"2030", text:"Improve progressively global resource efficiency in consumption and production and endeavour to decouple economic growth from environmental degradation"},
      {id:"8.5", year:"2030", text:"Achieve full and productive employment and decent work for all women and men, including for young people and persons with disabilities"},
      {id:"8.6", year:"2020", text:"Substantially reduce the proportion of youth not in employment, education or training"},
      {id:"8.7", year:null,   text:"Take immediate and effective measures to eradicate forced labour, end modern slavery and human trafficking and secure the prohibition of child labour"},
      {id:"8.8", year:null,   text:"Protect labour rights and promote safe and secure working environments for all workers, including migrant workers"},
      {id:"8.9", year:"2030", text:"Devise and implement policies to promote sustainable tourism that creates jobs and promotes local culture and products"},
      {id:"8.10",year:"2030", text:"Strengthen the capacity of domestic financial institutions to encourage and expand access to banking, insurance and financial services"},
      {id:"8.a", year:null,   text:"Increase Aid for Trade support for developing countries, in particular LDCs"},
      {id:"8.b", year:"2020", text:"Develop and operationalize a global strategy for youth employment"},
    ],
    indicators:["8.1.1 Annual growth rate of real GDP per capita","8.2.1 Annual growth rate of real GDP per employed person","8.3.1 Proportion of informal employment in total employment","8.4.1 Material footprint per capita and per GDP","8.4.2 Domestic material consumption per capita and per GDP","8.5.1 Average hourly earnings of employees","8.5.2 Unemployment rate","8.6.1 Proportion of youth not in education, employment or training","8.7.1 Proportion and number of children in child labour","8.8.1 Fatal and non-fatal occupational injuries per 100,000 workers","8.8.2 Level of national compliance with labour rights","8.9.1 Tourism GDP as proportion of total GDP","8.10.1 Number of commercial bank branches and ATMs per 100,000 adults","8.10.2 Proportion of adults with bank, mobile money or financial institution account"] },

  { id:9,  name:"Industry & Innovation", color:"#fd6925",
    overview:"Build resilient infrastructure, promote inclusive and sustainable industrialization, and foster innovation by investing in R&D, upgrading technologies, and expanding access to financial services.",
    targets:[
      {id:"9.1", year:null,   text:"Develop quality, reliable, sustainable and resilient infrastructure to support economic development and human well-being"},
      {id:"9.2", year:null,   text:"Promote inclusive and sustainable industrialization and by 2030 significantly raise industry's share of employment and GDP"},
      {id:"9.3", year:null,   text:"Increase the access of small-scale industrial and other enterprises to financial services and their integration into value chains and markets"},
      {id:"9.4", year:"2030", text:"Upgrade infrastructure and retrofit industries to make them sustainable, with increased resource-use efficiency and greater adoption of clean technologies"},
      {id:"9.5", year:"2030", text:"Enhance scientific research, upgrade the technological capabilities of industrial sectors and encourage innovation"},
      {id:"9.a", year:null,   text:"Facilitate sustainable and resilient infrastructure development in developing countries through enhanced financial, technological and technical support"},
      {id:"9.b", year:null,   text:"Support domestic technology development, research and innovation in developing countries"},
      {id:"9.c", year:null,   text:"Significantly increase access to information and communications technology and strive to provide universal and affordable access to the Internet"},
    ],
    indicators:["9.1.1 Proportion of rural population who live within 2 km of an all-season road","9.1.2 Passenger and freight volumes by mode of transport","9.2.1 Manufacturing value added as proportion of GDP","9.2.2 Manufacturing employment as proportion of total employment","9.3.1 Proportion of small-scale industries in total industry value added","9.3.2 Proportion of small-scale industries with a loan or line of credit","9.4.1 CO2 emission per unit of value added","9.5.1 Research and development expenditure as % of GDP","9.5.2 Researchers (in full-time equivalent) per 1,000,000 inhabitants","9.a.1 Total official international support to infrastructure","9.b.1 Proportion of medium/high-tech industry value added","9.c.1 Proportion of population covered by mobile network"] },

  { id:10, name:"Reduced Inequalities", color:"#dd1367",
    overview:"Reduce inequality within and among countries by promoting income growth for the bottom 40%, ensuring equal opportunity, and regulating financial markets.",
    targets:[
      {id:"10.1", year:"2030", text:"Progressively achieve and sustain income growth of the bottom 40% of the population at a rate higher than the national average"},
      {id:"10.2", year:"2030", text:"Empower and promote the social, economic and political inclusion of all, irrespective of age, sex, disability, race, ethnicity, origin, religion or economic status"},
      {id:"10.3", year:null,   text:"Ensure equal opportunity and reduce inequalities of outcome, including by eliminating discriminatory laws, policies and practices"},
      {id:"10.4", year:null,   text:"Adopt policies, especially fiscal, wage and social protection policies, and progressively achieve greater equality"},
      {id:"10.5", year:null,   text:"Improve the regulation and monitoring of global financial markets and institutions and strengthen the implementation of such regulations"},
      {id:"10.6", year:null,   text:"Ensure enhanced representation and voice for developing countries in decision-making in global international economic and financial institutions"},
      {id:"10.7", year:null,   text:"Facilitate orderly, safe, regular and responsible migration and mobility of people"},
      {id:"10.a", year:null,   text:"Implement the principle of special and differential treatment for developing countries in accordance with WTO agreements"},
      {id:"10.b", year:null,   text:"Encourage official development assistance and financial flows to States where the need is greatest"},
      {id:"10.c", year:"2030", text:"Reduce to less than 3% the transaction costs of migrant remittances and eliminate remittance corridors with costs higher than 5%"},
    ],
    indicators:["10.1.1 Growth rates of household expenditure per capita for bottom 40%","10.2.1 Proportion of people living below 50% of median income","10.3.1 Proportion of population reporting discrimination or harassment","10.4.1 Labour share of GDP","10.4.2 Redistributive impact of fiscal policy","10.5.1 Financial Soundness Indicators","10.6.1 Proportion of members and voting rights of developing countries in international organizations","10.7.1 Recruitment cost borne by employee as proportion of monthly income","10.7.2 Number of countries with migration policies that facilitate orderly, safe migration","10.a.1 Proportion of tariff lines applied to imports from LDCs","10.b.1 Total resource flows for development","10.c.1 Remittance costs as proportion of amount remitted"] },

  { id:11, name:"Sustainable Cities", color:"#fd9d24",
    overview:"Make cities and human settlements inclusive, safe, resilient and sustainable through affordable housing, sustainable transport, green spaces, and reduced urban environmental impact.",
    targets:[
      {id:"11.1", year:"2030", text:"Ensure access for all to adequate, safe and affordable housing and basic services and upgrade slums"},
      {id:"11.2", year:"2030", text:"Provide access to safe, affordable, accessible and sustainable transport systems for all"},
      {id:"11.3", year:"2030", text:"Enhance inclusive and sustainable urbanization and capacity for participatory, integrated and sustainable human settlement planning"},
      {id:"11.4", year:null,   text:"Strengthen efforts to protect and safeguard the world's cultural and natural heritage"},
      {id:"11.5", year:"2030", text:"Significantly reduce the number of deaths and people affected by disasters, including water-related disasters"},
      {id:"11.6", year:"2030", text:"Reduce the adverse per capita environmental impact of cities, including by paying special attention to air quality and municipal and other waste management"},
      {id:"11.7", year:"2030", text:"Provide universal access to safe, inclusive and accessible, green and public spaces, in particular for women and children, older persons and persons with disabilities"},
      {id:"11.a", year:null,   text:"Support positive economic, social and environmental links between urban, peri-urban and rural areas"},
      {id:"11.b", year:"2020", text:"Substantially increase the number of cities and human settlements adopting and implementing integrated policies towards inclusion, resource efficiency, mitigation and adaptation to climate change"},
      {id:"11.c", year:null,   text:"Support least developed countries, including through financial and technical assistance, in building sustainable and resilient buildings"},
    ],
    indicators:["11.1.1 Proportion of urban population living in slums or informal settlements","11.2.1 Proportion with convenient access to public transport","11.3.1 Ratio of land consumption rate to population growth rate","11.3.2 Proportion of cities with participatory urban planning","11.4.1 Total per capita expenditure on preservation of cultural and natural heritage","11.5.1 Number of deaths, missing persons and affected persons attributed to disasters","11.5.2 Direct economic loss in relation to GDP from disasters","11.6.1 Proportion of urban solid waste regularly collected and discharged","11.6.2 Annual mean levels of fine particulate matter (PM2.5) in cities","11.7.1 Average share of the built-up area of cities that is open space for public use","11.7.2 Proportion of persons victim of physical or sexual harassment","11.b.1 Countries adopting and implementing national DRR strategies"] },

  { id:12, name:"Responsible Consumption", color:"#bf8b2e",
    overview:"Ensure sustainable consumption and production patterns by achieving sustainable management of natural resources, halving food waste, managing chemicals responsibly, and promoting sustainable corporate practices.",
    targets:[
      {id:"12.1", year:null,   text:"Implement the 10-Year Framework of Programmes on Sustainable Consumption and Production Patterns"},
      {id:"12.2", year:"2030", text:"Achieve the sustainable management and efficient use of natural resources"},
      {id:"12.3", year:"2030", text:"Halve per capita global food waste at the retail and consumer levels and reduce food losses along production and supply chains"},
      {id:"12.4", year:"2020", text:"Achieve the environmentally sound management of chemicals and all wastes throughout their life cycle"},
      {id:"12.5", year:"2030", text:"Substantially reduce waste generation through prevention, reduction, recycling and reuse"},
      {id:"12.6", year:null,   text:"Encourage companies, especially large and transnational companies, to adopt sustainable practices and to integrate sustainability information into their reporting cycle"},
      {id:"12.7", year:null,   text:"Promote public procurement practices that are sustainable, in accordance with national policies and priorities"},
      {id:"12.8", year:"2030", text:"Ensure that people everywhere have the relevant information and awareness for sustainable development"},
      {id:"12.a", year:null,   text:"Support developing countries to strengthen their scientific and technological capacity to move towards more sustainable patterns of consumption and production"},
      {id:"12.b", year:null,   text:"Develop and implement tools to monitor sustainable development impacts for sustainable tourism"},
      {id:"12.c", year:null,   text:"Rationalize inefficient fossil-fuel subsidies that encourage wasteful consumption"},
    ],
    indicators:["12.1.1 Number of countries with sustainable consumption and production national action plans","12.2.1 Material footprint and material footprint per capita","12.2.2 Domestic material consumption per capita","12.3.1 (a) Food Loss Index and (b) Food Waste Index","12.4.1 Number of parties to international multilateral environmental agreements","12.4.2 Hazardous waste generated per capita and proportion treated","12.5.1 National recycling rate","12.6.1 Number of companies publishing sustainability reports","12.7.1 Number of countries implementing sustainable public procurement policies","12.8.1 Extent to which education for sustainable development is mainstreamed","12.a.1 Installed renewable energy-generating capacity in developing countries","12.b.1 Number of sustainable tourism strategies or policies","12.c.1 Amount of fossil-fuel subsidies"] },

  { id:13, name:"Climate Action", color:"#3f7e44",
    overview:"Take urgent action to combat climate change and its impacts by strengthening resilience, integrating climate measures into policy, improving education on climate, and mobilizing climate finance.",
    targets:[
      {id:"13.1", year:null,   text:"Strengthen resilience and adaptive capacity to climate-related hazards and natural disasters in all countries"},
      {id:"13.2", year:"2020", text:"Integrate climate change measures into national policies, strategies and planning"},
      {id:"13.3", year:null,   text:"Improve education, awareness-raising and human and institutional capacity on climate change mitigation, adaptation, impact reduction and early warning"},
      {id:"13.a", year:"2020", text:"Implement the commitment of developed-country parties to the UNFCCC to mobilize $100 billion annually by 2020 from all sources to address the needs of developing countries"},
      {id:"13.b", year:null,   text:"Promote mechanisms for raising capacity for effective climate change-related planning and management in least developed countries and small island developing States"},
    ],
    indicators:["13.1.1 Number of countries with national and local DRR strategies","13.1.2 Number of deaths, missing persons and affected by disasters per 100,000","13.1.3 Proportion of local governments with DRR strategies","13.2.1 Number of countries with NDCs, long-term strategies, national adaptation plans","13.2.2 Total greenhouse gas emissions per year","13.3.1 Extent to which climate change education is included in national curricula","13.a.1 Amounts provided and mobilized in USD for climate finance to developing countries","13.b.1 Number of LDCs and SIDS with contributions to climate finance mechanisms"] },

  { id:14, name:"Life Below Water", color:"#0a97d9",
    overview:"Conserve and sustainably use the oceans, seas and marine resources by reducing marine pollution, protecting ecosystems, ending overfishing, and increasing scientific knowledge of ocean health.",
    targets:[
      {id:"14.1", year:"2025", text:"Prevent and significantly reduce marine pollution of all kinds, in particular from land-based activities"},
      {id:"14.2", year:"2020", text:"Sustainably manage and protect marine and coastal ecosystems to avoid significant adverse impacts"},
      {id:"14.3", year:null,   text:"Minimize and address the impacts of ocean acidification, including through enhanced scientific cooperation at all levels"},
      {id:"14.4", year:"2020", text:"Effectively regulate harvesting and end overfishing, illegal, unreported and unregulated fishing and destructive fishing practices"},
      {id:"14.5", year:"2020", text:"Conserve at least 10% of coastal and marine areas"},
      {id:"14.6", year:"2020", text:"Prohibit certain forms of fisheries subsidies which contribute to overcapacity and overfishing"},
      {id:"14.7", year:"2030", text:"Increase the economic benefits to SIDS and LDCs from the sustainable use of marine resources"},
      {id:"14.a", year:null,   text:"Increase scientific knowledge, develop research capacity and transfer marine technology"},
      {id:"14.b", year:null,   text:"Provide access for small-scale artisanal fishers to marine resources and markets"},
      {id:"14.c", year:null,   text:"Enhance the conservation and sustainable use of oceans and their resources through UNCLOS"},
    ],
    indicators:["14.1.1 Index of coastal eutrophication and floating plastic debris","14.2.1 Proportion of national exclusive economic zones managed using ecosystem-based approaches","14.3.1 Average marine acidity (pH) measured at agreed suite of representative sampling stations","14.4.1 Proportion of fish stocks within biologically sustainable levels","14.5.1 Coverage of protected areas in relation to marine areas","14.6.1 Degree of implementation of international instruments to combat illegal fishing","14.7.1 Sustainable fisheries as a proportion of GDP","14.a.1 Proportion of total research budget allocated to research in the field of marine technology","14.b.1 Progress by countries in the degree of application of a legal/regulatory/policy framework for small-scale fisheries","14.c.1 Number of countries making progress in ratifying/acceding to and implementing UNCLOS"] },

  { id:15, name:"Life on Land", color:"#56c02b",
    overview:"Protect, restore and promote sustainable use of terrestrial ecosystems by halting deforestation, restoring degraded land, combating desertification, and preventing biodiversity loss.",
    targets:[
      {id:"15.1", year:"2020", text:"Ensure the conservation, restoration and sustainable use of terrestrial and inland freshwater ecosystems"},
      {id:"15.2", year:"2020", text:"Promote the implementation of sustainable management of all types of forests, halt deforestation, restore degraded forests"},
      {id:"15.3", year:"2030", text:"Combat desertification, restore degraded land and soil, including land affected by desertification, drought and floods, and strive to achieve a land degradation-neutral world"},
      {id:"15.4", year:"2030", text:"Ensure the conservation of mountain ecosystems, including their biodiversity, in order to enhance their capacity to provide benefits"},
      {id:"15.5", year:"2020", text:"Take urgent and significant action to reduce the degradation of natural habitats, halt the loss of biodiversity and protect and prevent the extinction of threatened species"},
      {id:"15.6", year:null,   text:"Promote fair and equitable sharing of the benefits arising from the utilization of genetic resources"},
      {id:"15.7", year:null,   text:"Take urgent action to end poaching and trafficking of protected species of flora and fauna"},
      {id:"15.8", year:"2020", text:"Introduce measures to prevent the introduction and significantly reduce the impact of invasive alien species"},
      {id:"15.9", year:"2020", text:"Integrate ecosystem and biodiversity values into national and local planning, development processes and poverty reduction strategies"},
      {id:"15.a", year:null,   text:"Mobilize and significantly increase financial resources from all sources to conserve and sustainably use biodiversity and ecosystems"},
      {id:"15.b", year:null,   text:"Mobilize significant resources from all sources and at all levels to finance sustainable forest management"},
      {id:"15.c", year:null,   text:"Enhance global support for efforts to combat poaching and trafficking of protected species"},
    ],
    indicators:["15.1.1 Forest area as a proportion of total land area","15.1.2 Proportion of important sites for biodiversity covered by protected areas","15.2.1 Progress towards sustainable forest management","15.3.1 Proportion of land that is degraded over total land area","15.4.1 Coverage by protected areas of important sites for mountain biodiversity","15.4.2 Mountain Green Cover Index","15.5.1 Red List Index","15.6.1 Countries that have adopted national legislation and ABS measures","15.7.1 Proportion of traded wildlife detected as poached or illicitly traded","15.8.1 Countries adopting relevant national legislation on invasive alien species","15.9.1 Progress towards national targets in accordance with Aichi Biodiversity Target 2","15.a.1 ODA and public expenditure on conservation and sustainable use of biodiversity","15.b.1 ODA and public expenditure on conservation and sustainable use of biodiversity"] },

  { id:16, name:"Peace & Justice", color:"#00689d",
    overview:"Promote peaceful and inclusive societies, provide access to justice for all, and build effective, accountable and inclusive institutions at all levels.",
    targets:[
      {id:"16.1", year:null,   text:"Significantly reduce all forms of violence and related death rates everywhere"},
      {id:"16.2", year:null,   text:"End abuse, exploitation, trafficking and all forms of violence against and torture of children"},
      {id:"16.3", year:null,   text:"Promote the rule of law at the national and international levels and ensure equal access to justice for all"},
      {id:"16.4", year:"2030", text:"Significantly reduce illicit financial and arms flows, strengthen the recovery and return of stolen assets and combat all forms of organized crime"},
      {id:"16.5", year:null,   text:"Substantially reduce corruption and bribery in all their forms"},
      {id:"16.6", year:null,   text:"Develop effective, accountable and transparent institutions at all levels"},
      {id:"16.7", year:null,   text:"Ensure responsive, inclusive, participatory and representative decision-making at all levels"},
      {id:"16.8", year:null,   text:"Broaden and strengthen the participation of developing countries in the institutions of global governance"},
      {id:"16.9", year:"2030", text:"Provide legal identity for all, including birth registration"},
      {id:"16.10",year:null,   text:"Ensure public access to information and protect fundamental freedoms, in accordance with national legislation"},
      {id:"16.a", year:null,   text:"Strengthen relevant national institutions for building capacity at all levels to prevent violence and combat terrorism and crime"},
      {id:"16.b", year:null,   text:"Promote and enforce non-discriminatory laws and policies for sustainable development"},
    ],
    indicators:["16.1.1 Number of victims of intentional homicide per 100,000 population","16.1.2 Conflict-related deaths per 100,000 population","16.1.3 Proportion of population subjected to physical, psychological or sexual violence","16.1.4 Proportion of population that feel safe walking alone around the area they live","16.2.1 Proportion of children subjected to physical punishment and/or psychological aggression","16.2.2 Number of victims of human trafficking per 100,000 population","16.2.3 Proportion of young women and men who experienced sexual violence by age 18","16.3.1 Proportion of victims of violence who reported to police","16.3.2 Unsentenced detainees as proportion of overall prison population","16.3.3 Proportion who have experienced a dispute and accessed a formal/informal dispute resolution mechanism","16.4.1 Total value of inward and outward illicit financial flows","16.4.2 Proportion of seized small arms that are recorded and traced","16.5.1 Proportion of persons who had at least one contact with a public official and who paid a bribe","16.6.1 Primary government expenditures as a proportion of original approved budget","16.6.2 Proportion of population satisfied with their last experience of public services","16.7.1 Proportions of positions in national/local institutions in inclusive societies","16.9.1 Proportion of children under 5 whose births have been registered","16.10.1 Number of verified cases of killing/kidnapping/enforced disappearance of journalists","16.10.2 Number of countries adopting and implementing constitutional/statutory/policy guarantees for public access to information","16.a.1 Existence of independent national human rights institutions"] },

  { id:17, name:"Partnerships for Goals", color:"#19486a",
    overview:"Strengthen the means of implementation and revitalize the global partnership for sustainable development through finance, technology, capacity building, trade, and systemic issues.",
    targets:[
      {id:"17.1", year:null,   text:"Strengthen domestic resource mobilization to improve domestic capacity for tax and other revenue collection"},
      {id:"17.2", year:null,   text:"Developed countries to implement fully their ODA commitments of 0.7% of GNI"},
      {id:"17.3", year:null,   text:"Mobilize additional financial resources for developing countries from multiple sources"},
      {id:"17.4", year:null,   text:"Assist developing countries in attaining long-term debt sustainability"},
      {id:"17.5", year:null,   text:"Adopt and implement investment promotion regimes for LDCs"},
      {id:"17.6", year:null,   text:"Enhance North-South, South-South and triangular regional and international cooperation on science, technology and innovation"},
      {id:"17.7", year:null,   text:"Promote the development, transfer, dissemination and diffusion of environmentally sound technologies to developing countries"},
      {id:"17.8", year:"2017", text:"Fully operationalize the technology bank and STI capacity-building mechanism for LDCs"},
      {id:"17.9", year:null,   text:"Enhance international support for implementing effective and targeted capacity-building in developing countries"},
      {id:"17.10",year:null,   text:"Promote a universal, rules-based, open, non-discriminatory and equitable multilateral trading system under the WTO"},
      {id:"17.11",year:"2020", text:"Significantly increase the exports of developing countries, in particular with a view to doubling the LDC share of global exports"},
      {id:"17.12",year:null,   text:"Realize timely implementation of duty-free and quota-free market access on a lasting basis for all least developed countries"},
      {id:"17.13",year:null,   text:"Enhance global macroeconomic stability, including through policy coordination and policy coherence"},
      {id:"17.14",year:null,   text:"Enhance policy coherence for sustainable development"},
      {id:"17.15",year:null,   text:"Respect each country's policy space and leadership to establish and implement policies for poverty eradication and sustainable development"},
      {id:"17.16",year:null,   text:"Enhance the global partnership for sustainable development, complemented by multi-stakeholder partnerships"},
      {id:"17.17",year:null,   text:"Encourage and promote effective public, public-private and civil society partnerships"},
      {id:"17.18",year:"2020", text:"Enhance capacity-building support to developing countries to increase significantly the availability of high-quality, timely and reliable data"},
      {id:"17.19",year:"2030", text:"Build on existing initiatives to develop measurements of progress on sustainable development that complement GDP"},
    ],
    indicators:["17.1.1 Total government revenue as a proportion of GDP","17.1.2 Proportion of domestic budget funded by domestic taxes","17.2.1 Net ODA as a proportion of OECD/DAC donors' GNI","17.3.1 Foreign direct investments as a proportion of GDP","17.3.2 Volume of remittances as a proportion of total GDP","17.4.1 Debt service as a proportion of exports of goods and services","17.6.1 Fixed broadband subscriptions per 100 inhabitants by speed","17.7.1 Total amount of funding for developing countries to promote clean tech","17.8.1 Proportion of individuals using the Internet","17.9.1 Dollar value of financial and technical assistance to developing countries","17.10.1 Worldwide weighted tariff-average","17.11.1 Developing countries' and LDCs' share of global exports","17.12.1 Weighted average tariffs faced by developing countries","17.15.1 Extent of use of country-owned results frameworks","17.16.1 Number of countries reporting progress in multi-stakeholder development effectiveness monitoring","17.17.1 Amount in USD committed to PPPs","17.18.1 Statistical capacity indicator for SDG monitoring","17.19.1 Dollar value of all resources made available to strengthen statistical capacity","17.19.2 Proportion of countries having conducted at least one population and housing census"] },
];

// Known authoritative sustainability URLs — V1 org set
const KNOWN_ORGS = {
  "google":    { url:"https://sustainability.google",               display:"Google" },
  "meta":      { url:"https://sustainability.fb.com",              display:"Meta" },
  "amazon":    { url:"https://sustainability.aboutamazon.com",     display:"Amazon" },
  "microsoft": { url:"https://microsoft.com/en-us/sustainability", display:"Microsoft" },
};

// ═══════════════════════════════════════════════════════════════════
// AI PROMPTS — Named constants, easy to read and improve
// ═══════════════════════════════════════════════════════════════════
const buildExtractionPrompt = (orgName, orgURL) => `
You are an expert sustainability analyst. Extract sustainability goals from ${orgName}'s official sustainability website.

AUTHORITATIVE SOURCE RULE (non-negotiable):
- ONLY extract goals from ${orgURL} and its subpages.
- Do NOT use Wikipedia, news articles, ESG databases, or any third-party source.
- Every goal must cite the company's own published content.
- If you cannot access the page, say so clearly — do not fabricate.

WHAT TO EXTRACT:
- Explicit commitments with quantified targets (e.g. "net zero by 2040", "100% renewable energy by 2025")
- Named programs with measurable outcomes
- Both high-level pledges AND specific operational programs — label each as "pledge" or "program"
- Do NOT extract: generic values, mission statements, or unquantified aspirations

Respond with ONLY valid JSON:
{
  "goals": [
    {
      "title": "Full goal statement as stated by the company",
      "tier": "pledge or program",
      "sourceSection": "Section or page name where found",
      "sourceURL": "Specific URL or ${orgURL} if on the main page"
    }
  ]
}
Extract up to 6 goals. Prioritize the most specific, quantified commitments. Quality over quantity.`;

const buildAnalysisPrompt = (orgName, goal) => `You are a senior UN SDG analyst with deep expertise in corporate sustainability, ecology, supply chains, and systems thinking. Your role is to produce rigorous, non-obvious SDG analysis — not generic sustainability consulting.

ORG: ${orgName}
GOAL: "${goal.title}"

STEP 1 — REASON THROUGH THESE LENSES BEFORE WRITING OUTPUT (this structured thinking ensures consistent, non-obvious insights):

A) DIRECT SDG LINKS: Which SDGs does this goal directly advance? Be precise about causal mechanism.

B) SECOND-ORDER EFFECTS: What happens downstream? (e.g. a solar goal → land use for panels → pollinator habitat disruption → SDG 15; wind energy → turbine blade bird mortality → SDG 15.5; EV batteries → cobalt mining → child labour → SDG 8.7; data centres for AI → water cooling → SDG 6.4)

C) SUPPLY CHAIN TENSIONS: What upstream or downstream supply chain harms does this goal create or ignore? (e.g. "sustainable packaging" → deforestation for biomaterials; "carbon neutral" → offsets that displace indigenous communities → SDG 10.2)

D) EQUITY & JUSTICE LENS: Does this goal risk exacerbating inequality? (e.g. clean energy transitions that raise energy costs for low-income users → SDG 1; green jobs that require retraining older workers → SDG 8.6)

E) BIODIVERSITY & ECOSYSTEM LENS: Always check SDG 14 and 15 even for non-environmental goals. (e.g. green infrastructure → invasive species risk; circular economy → microplastic contamination in waterways)

F) WHAT WOULD MAKE THIS GOAL TRULY TRANSFORMATIVE: What specific, measurable actions — referencing real UN indicator numbers — would move the needle on the identified gaps?

STEP 2 — OUTPUT your analysis as ONLY this JSON object. No prose before or after. Must start with { and end with }:

{
  "sdgMappings": [
    {"sdgId": 7, "sdgName": "Affordable & Clean Energy", "type": "primary", "confidence": "High", "reasoning": "2-3 sentence causal explanation grounded in the specific goal language, not generic sustainability claims."}
  ],
  "positiveImpacts": [
    {"targetId": "7.2", "targetText": "Increase substantially the share of renewable energy in the global energy mix", "indicator": "7.2.1", "mechanism": "Specific mechanism explaining how this goal advances this exact target — cite the goal's own language."}
  ],
  "negativeTradeoffs": [
    {"targetId": "15.5", "targetText": "Take urgent action to reduce degradation of natural habitats and halt biodiversity loss", "mechanism": "Concrete second-order or supply chain causal pathway — e.g. wind turbine blade mortality, solar farm land conversion, battery mineral extraction. Must be specific, not generic.", "severity": "Moderate tension"}
  ],
  "targetsTable": [
    {"targetId": "7.2", "targetText": "Brief target description", "direction": "positive", "indicator": "7.2.1"}
  ],
  "recommendations": [
    "Specific recommendation that directly mitigates the most severe trade-off identified — reference a real UN indicator (e.g. 15.5.1 Red List Index) and a concrete program type (e.g. biodiversity net gain standard, pollinator-friendly solar guidelines).",
    "Recommendation addressing the equity/justice dimension — who might be left behind by this goal and what policy mechanism addresses it.",
    "Recommendation to extend the goal's positive impact to an SDG not currently covered — cite the specific target ID.",
    "Recommendation referencing a real industry standard, certification, or UN program that would strengthen this commitment (e.g. Science Based Targets, RE100, CDP, Taskforce on Nature-related Financial Disclosures)."
  ]
}

STRICT OUTPUT RULES:
- sdgMappings: 2-4 SDGs. type = "primary" or "secondary". confidence = "High", "Medium", or "Low".
- positiveImpacts: 2-4 items with real UN SDG target IDs.
- negativeTradeoffs: 1-3 items. severity must be exactly "Minor friction", "Moderate tension", or "Significant risk". Never return [] — every corporate goal has at least one tension.
- targetsTable: all affected targets combined. direction = "positive" or "negative".
- recommendations: exactly 4 strings. Each must be specific and actionable — never generic. Each must reference either a real UN indicator number, a real certification/standard, or a named program type.
- Return ONLY valid JSON. No markdown. No explanation.`;

// ═══════════════════════════════════════════════════════════════════
// API CALL — Claude artifact environment handles auth + CORS
// ═══════════════════════════════════════════════════════════════════
async function callClaude(prompt, useWebSearch = false) {
  const body = {
    model: "claude-sonnet-4-20250514",
    max_tokens: 8000,
    temperature: 0,   // deterministic — always picks highest-probability token
    messages: [{ role: "user", content: prompt }],
  };
  if (useWebSearch) {
    body.tools = [{ type: "web_search_20250305", name: "web_search" }];
  }
  // In production: calls our Vercel proxy which injects the API key server-side.
  // In local dev: Vite proxies /api → localhost:3001 (see vite.config.js).
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let errMsg = `API error ${res.status}`;
    try {
      const e = await res.json();
      errMsg = e.error?.message || e.message || errMsg;
    } catch (_) {}
    throw new Error(errMsg);
  }
  const data = await res.json();
  // stop_reason "max_tokens" means the response was cut off — JSON will be invalid
  if (data.stop_reason === "max_tokens") {
    throw new Error("Response was too long and got cut off. Try analyzing fewer goals at once.");
  }
  const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n");
  if (!text.trim()) throw new Error("Empty response from API");
  return text;
}

function parseJSON(text) {
  const clean = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  const start = clean.search(/[{\[]/);
  const end   = Math.max(clean.lastIndexOf("}"), clean.lastIndexOf("]"));
  if (start === -1 || end === -1) throw new Error(`No JSON found in response. Got: ${clean.slice(0,200)}`);
  try {
    return JSON.parse(clean.slice(start, end + 1));
  } catch (e) {
    throw new Error(`JSON parse failed: ${e.message}. Response snippet: ${clean.slice(start, start+300)}`);
  }
}

// ═══════════════════════════════════════════════════════════════════
// STYLES — Inline style objects for the React component
// ═══════════════════════════════════════════════════════════════════
const S = {
  // Layout
  app:      { fontFamily:"'Outfit', sans-serif", background:"#0b0f1a", color:"#e2e8f0", minHeight:"100vh", fontSize:15 },
  header:   { background:"rgba(11,15,26,0.95)", borderBottom:"1px solid #1e293b", padding:"0 40px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:200 },
  main:     { maxWidth:1160, margin:"0 auto", padding:"48px 32px 80px" },

  // Typography helpers
  mono:     { fontFamily:"'DM Mono', monospace" },
  serif:    { fontFamily:"'Fraunces', serif" },
  muted:    { color:"#64748b" },
  dim:      { color:"#94a3b8" },
  unblue:   { color:"#009edb" },

  // Surfaces
  card:     { background:"#111827", border:"1px solid #1e293b", borderRadius:10 },
  surface2: { background:"#1c2537", borderRadius:8 },

  // Buttons
  btnPrimary: { background:"#009edb", color:"#fff", border:"none", borderRadius:6, padding:"10px 22px", fontFamily:"'DM Mono', monospace", fontSize:12, fontWeight:500, cursor:"pointer", letterSpacing:"0.3px" },
  btnGhost:   { background:"transparent", color:"#64748b", border:"1px solid #1e293b", borderRadius:6, padding:"8px 16px", fontFamily:"'DM Mono', monospace", fontSize:12, cursor:"pointer" },
  btnGreen:   { background:"#22c55e", color:"#000", border:"none", borderRadius:6, padding:"10px 22px", fontFamily:"'DM Mono', monospace", fontSize:12, fontWeight:600, cursor:"pointer" },
};

// ═══════════════════════════════════════════════════════════════════
// FONT LOADER
// ═══════════════════════════════════════════════════════════════════
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,300&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap');
    * { box-sizing:border-box; margin:0; padding:0; }
    html { scroll-behavior:smooth; }
    ::placeholder { color:#475569; }
    input, textarea { outline:none; }
    a { color:#009edb; text-decoration:none; }
    a:hover { text-decoration:underline; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    @keyframes spin   { to{transform:rotate(360deg)} }
    @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.4} }
    .fade-up { animation:fadeUp 0.3s ease; }
    .spinner { width:18px;height:18px;border:2px solid #1e293b;border-top-color:#009edb;border-radius:50%;animation:spin 0.8s linear infinite;flex-shrink:0; }
  `}</style>
);

// ═══════════════════════════════════════════════════════════════════
// SDG POPOVER — contextual SDG info shown on click within analysis
// ═══════════════════════════════════════════════════════════════════
const SDGPopover = ({ sdg, onClose }) => {
  if (!sdg) return null;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}
         onClick={onClose}>
      <div style={{ ...S.card, maxWidth:640, width:"100%", maxHeight:"85vh", overflowY:"auto", animation:"fadeUp 0.2s ease" }}
           onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding:"24px 28px 20px", borderBottom:"1px solid #1e293b", background:`${sdg.color}18`, borderRadius:"10px 10px 0 0" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:14, height:14, borderRadius:"50%", background:sdg.color, flexShrink:0 }} />
              <span style={{ ...S.mono, fontSize:11, color:sdg.color, letterSpacing:"1.5px", textTransform:"uppercase" }}>SDG {sdg.id}</span>
            </div>
            <button onClick={onClose} style={{ background:"none", border:"none", color:"#64748b", fontSize:20, cursor:"pointer", lineHeight:1 }}>×</button>
          </div>
          <div style={{ ...S.serif, fontSize:22, fontWeight:600, color:"#e2e8f0", marginBottom:12 }}>{sdg.name}</div>
          <p style={{ fontSize:13, color:"#94a3b8", lineHeight:1.7 }}>{sdg.overview}</p>
        </div>

        {/* Targets */}
        <div style={{ padding:"20px 28px" }}>
          <div style={{ ...S.mono, fontSize:11, color:"#64748b", letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:6 }}>All Targets</div>
          <div style={{ fontSize:11, color:"#475569", marginBottom:14 }}>
            {sdg.targets.length} official targets · Target years shown where specified by the UN
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr>
                <th style={{ ...S.mono, fontSize:10, color:"#475569", textAlign:"left", padding:"6px 8px", borderBottom:"1px solid #1e293b", width:52 }}>ID</th>
                <th style={{ ...S.mono, fontSize:10, color:"#475569", textAlign:"left", padding:"6px 8px", borderBottom:"1px solid #1e293b" }}>Target</th>
                <th style={{ ...S.mono, fontSize:10, color:"#475569", textAlign:"right", padding:"6px 8px", borderBottom:"1px solid #1e293b", width:64, whiteSpace:"nowrap" }}>By Year</th>
              </tr>
            </thead>
            <tbody>
              {sdg.targets.map((t, i) => (
                <tr key={t.id} style={{ background: i%2===0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                  <td style={{ ...S.mono, fontSize:11, color:sdg.color, padding:"10px 8px", verticalAlign:"top", fontWeight:500 }}>{t.id}</td>
                  <td style={{ color:"#cbd5e1", padding:"10px 8px", lineHeight:1.5 }}>{t.text}</td>
                  <td style={{ ...S.mono, fontSize:11, textAlign:"right", padding:"10px 8px", verticalAlign:"top",
                    color: t.year ? "#fcd34d" : "#334155", fontWeight: t.year ? 500 : 400 }}>
                    {t.year || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* All indicators */}
          <div style={{ ...S.mono, fontSize:11, color:"#64748b", letterSpacing:"1.5px", textTransform:"uppercase", marginTop:22, marginBottom:6 }}>All Indicators</div>
          <div style={{ fontSize:11, color:"#475569", marginBottom:12 }}>{sdg.indicators.length} official indicators</div>
          {sdg.indicators.map((ind, i) => (
            <div key={i} style={{ padding:"8px 12px", background:"#1c2537", borderRadius:6, marginBottom:5, fontSize:12, color:"#cbd5e1", borderLeft:`3px solid ${sdg.color}`, lineHeight:1.5 }}>
              {ind}
            </div>
          ))}

          <div style={{ marginTop:18, textAlign:"center" }}>
            <a href={`https://sdgs.un.org/goals/goal${sdg.id}`} target="_blank" rel="noopener noreferrer"
               style={{ ...S.mono, fontSize:11, color:"#009edb" }}>
              View full UN SDG {sdg.id} documentation →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function App() {
  // Phases: hero → url → goals → analysis
  // "goals"    = list of extracted goals, user clicks one to analyze
  // "analysis" = 5-dimension result for the ONE goal the user clicked
  const [phase, setPhase]           = useState("hero");
  const [orgName, setOrgName]       = useState("");
  const [orgURL, setOrgURL]         = useState("");
  const [urlMsg, setUrlMsg]         = useState("");
  const [goals, setGoals]           = useState([]);
  const [analysis, setAnalysis]     = useState({});      // goalId → result (cached)
  const [activeGoal, setActiveGoal] = useState(null);    // goal currently being viewed
  const [analyzing, setAnalyzing]   = useState(false);   // spinner for single-goal API call
  const [loading, setLoading]       = useState(false);   // spinner for extraction
  const [error, setError]           = useState("");
  const [popoverSDG, setPopoverSDG] = useState(null);
  const [customText, setCustomText] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [toast, setToast]           = useState(null);
  const [expandedDims, setExpandedDims] = useState({});

  const toggleDim = (key) => setExpandedDims(prev => ({ ...prev, [key]: !prev[key] }));

  const showToast = (msg, err=false) => {
    setToast({ msg, err });
    setTimeout(() => setToast(null), 2800);
  };

  // Step 1: Org entry → URL confirmation
  const startFlow = useCallback((name) => {
    const raw = (name || orgName).trim();
    if (!raw) { showToast("Please enter an organization name", true); return; }
    const key   = raw.toLowerCase();
    const known = KNOWN_ORGS[key];
    const display = known?.display || raw;
    setOrgName(display);
    setOrgURL(known?.url || "");
    setUrlMsg(known
      ? `We have a verified authoritative sustainability URL for ${display}. Please confirm before we proceed.`
      : `We don't have a pre-verified URL for "${raw}". Please enter their official sustainability website — the company's own domain only.`
    );
    setPhase("url");
    setError("");
  }, [orgName]);

  // Step 2: URL confirmed → extract goals from the page
  const confirmURL = useCallback(async () => {
    if (!orgURL || !orgURL.startsWith("http")) {
      showToast("Please enter a valid URL starting with https://", true); return;
    }
    setPhase("goals");
    setLoading(true);
    setGoals([]);
    setAnalysis({});
    setError("");
    try {
      const raw    = await callClaude(buildExtractionPrompt(orgName, orgURL), true);
      const parsed = parseJSON(raw);
      if (!parsed.goals?.length) throw new Error("No goals found. Try providing a more specific URL.");
      setGoals(parsed.goals.map((g, i) => ({
        id: `scraped-${i}`, title: g.title, tier: g.tier || "program",
        source: g.sourceSection || "Official sustainability website",
        sourceURL: g.sourceURL || orgURL, isCustom: false,
      })));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [orgName, orgURL]);

  // Flow B: custom goal entry
  const addCustomGoal = () => {
    if (!customText.trim()) { showToast("Please enter a goal description", true); return; }
    setGoals(prev => [...prev, {
      id: `custom-${Date.now()}`, title: customText.trim(),
      tier: "custom", source: "User-added (not from official source)",
      sourceURL: null, isCustom: true,
    }]);
    setCustomText(""); setShowAddForm(false);
    showToast("Custom goal added");
  };

  const removeGoal = (id) => setGoals(prev => prev.filter(g => g.id !== id));

  // Step 3: Analyze ONE goal on demand — called when user clicks "Analyze" on a card.
  // Results are cached: clicking the same goal again is instant.
  const analyzeGoal = useCallback(async (goal) => {
    setActiveGoal(goal);
    setPhase("analysis");
    if (analysis[goal.id] && !analysis[goal.id].error) return; // use cache
    setAnalyzing(true);
    try {
      const raw    = await callClaude(buildAnalysisPrompt(orgName, goal));
      const result = parseJSON(raw);
      setAnalysis(prev => ({ ...prev, [goal.id]: { ...result, error: null } }));
    } catch (e) {
      setAnalysis(prev => ({ ...prev, [goal.id]: { error: e.message } }));
    } finally {
      setAnalyzing(false);
    }
  }, [orgName, analysis]);

  const backToGoals = () => { setPhase("goals"); setActiveGoal(null); setAnalyzing(false); };

  const reset = () => {
    setPhase("hero"); setOrgName(""); setOrgURL(""); setGoals([]);
    setAnalysis({}); setActiveGoal(null); setError("");
  };

  // Derived
  const coveredSDGIds  = new Set(Object.values(analysis).flatMap(a => a?.sdgMappings?.map(m => m.sdgId) || []));
  const analyzedCount  = goals.filter(g => analysis[g.id] && !analysis[g.id].error).length;
  const gapSDGs        = SDGS.filter(s => !coveredSDGIds.has(s.id));

  const exportCSV = () => {
    const done = goals.filter(g => analysis[g.id] && !analysis[g.id].error);
    if (!done.length) { showToast("Analyze at least one goal first", true); return; }
    const q = s => `"${String(s||"").replace(/"/g,'""')}"`;
    const today = new Date().toISOString().split("T")[0];
    const headers = ["Goal","Type","Source","Source URL","Primary SDGs","Secondary SDGs","Positive Targets","Negative Tradeoffs","Rec 1","Rec 2","Rec 3","Date"];
    const rows = done.map(g => {
      const a = analysis[g.id];
      const pri = (a.sdgMappings||[]).filter(m=>m.type==="primary").map(m=>`SDG ${m.sdgId}`).join("; ");
      const sec = (a.sdgMappings||[]).filter(m=>m.type!=="primary").map(m=>`SDG ${m.sdgId}`).join("; ");
      const pos = (a.positiveImpacts||[]).map(i=>i.targetId).join("; ");
      const neg = (a.negativeTradeoffs||[]).map(t=>`${t.targetId}(${t.severity})`).join("; ");
      const rec = a.recommendations||[];
      return [q(g.title),q(g.isCustom?"custom":g.tier),q(g.source),q(g.sourceURL),q(pri),q(sec),q(pos),q(neg),q(rec[0]),q(rec[1]),q(rec[2]),q(today)].join(",");
    });
    const blob = new Blob([[headers.join(","),...rows].join("\n")],{type:"text/csv"});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href=url; a.download=`sdg-${orgName.toLowerCase().replace(/\s+/g,"-")}-${today}.csv`; a.click();
    URL.revokeObjectURL(url);
    showToast("CSV exported!");
  };

  // ── Shared dim renderer (used in analysis phase) ──────────────
  const a = activeGoal ? analysis[activeGoal.id] : null;

  return (
    <div style={S.app}>
      <FontLoader />
      {popoverSDG && <SDGPopover sdg={popoverSDG} onClose={() => setPopoverSDG(null)} />}
      {toast && (
        <div style={{ position:"fixed", bottom:24, right:24,
          background: toast.err?"#ef4444":"#22c55e", color: toast.err?"#fff":"#000",
          fontFamily:"'DM Mono',monospace", fontSize:12, fontWeight:500,
          padding:"10px 18px", borderRadius:6, zIndex:9999, animation:"fadeUp 0.2s ease" }}>
          {toast.msg}
        </div>
      )}

      {/* HEADER */}
      <header style={S.header}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:32, height:32, background:"#009edb", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", ...S.mono, fontSize:11, fontWeight:500, color:"#fff" }}>SDG</div>
          <span style={{ ...S.serif, fontSize:18, fontWeight:600 }}>Goal Mapper</span>
          <span style={{ ...S.mono, fontSize:10, color:"#009edb", background:"#0c2a3d", padding:"2px 8px", borderRadius:4, letterSpacing:"1px", textTransform:"uppercase" }}>Prototype</span>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          {phase === "analysis" && <button style={S.btnGhost} onClick={backToGoals}>← Back to Goals</button>}
          {phase === "goals" && analyzedCount > 0 && <button style={S.btnGhost} onClick={exportCSV}>⬇ Export CSV ({analyzedCount})</button>}
          {(phase === "url" || phase === "goals") && <button style={S.btnGhost} onClick={reset}>✕ New</button>}
        </div>
      </header>

      {/* WORKFLOW PROGRESS BAR */}
      {phase !== "hero" && (() => {
        const steps = [
          { key:"url",      label:"Choose Org",      num:1 },
          { key:"goals",    label:"Extract Goals",   num:2 },
          { key:"analysis", label:"Run SDG Analysis",num:3 },
          { key:"done",     label:"View Results",    num:4 },
        ];
        // Determine step statuses
        const phaseOrder = ["url","goals","analysis"];
        const currentIdx = phaseOrder.indexOf(phase);
        const hasAnalysis = phase === "analysis" && activeGoal && a && !a?.error && !analyzing;
        const stepStatus = (stepKey) => {
          if (stepKey === "url") return currentIdx >= 0 ? (currentIdx > 0 || phase === "url" ? "done" : "active") : "pending";
          if (stepKey === "goals") {
            if (phase === "url") return "pending";
            if (phase === "goals" && loading) return "active";
            if (phase === "goals" && error) return "error";
            if (phase === "goals" || phase === "analysis") return "done";
            return "pending";
          }
          if (stepKey === "analysis") {
            if (phase !== "analysis") return "pending";
            if (analyzing) return "active";
            if (a?.error) return "error";
            if (a && !a.error) return "done";
            return "active";
          }
          if (stepKey === "done") {
            return hasAnalysis ? "done" : "pending";
          }
        };
        return (
          <div style={{ background:"#0d1220", borderBottom:"1px solid #1e293b", padding:"0 40px" }}>
            <div style={{ maxWidth:1160, margin:"0 auto", display:"flex", alignItems:"center", padding:"10px 0", gap:0 }}>
              {steps.map((step, i) => {
                const status = stepStatus(step.key);
                const isLast = i === steps.length - 1;
                const dotColor = status === "done" ? "#22c55e" : status === "error" ? "#ef4444" : status === "active" ? "#009edb" : "#1e293b";
                const labelColor = status === "done" ? "#22c55e" : status === "error" ? "#ef4444" : status === "active" ? "#e2e8f0" : "#475569";
                return (
                  <div key={step.key} style={{ display:"flex", alignItems:"center", flex: isLast ? "0 0 auto" : 1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7, flexShrink:0 }}>
                      <div style={{ width:20, height:20, borderRadius:"50%",
                        background: status === "done" ? "#22c55e" : status === "error" ? "#ef4444" : status === "active" ? "#009edb22" : "#111827",
                        border: `2px solid ${dotColor}`,
                        display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        {status === "done" && <span style={{ color:"#000", fontSize:10, fontWeight:700, lineHeight:1 }}>✓</span>}
                        {status === "error" && <span style={{ color:"#fff", fontSize:10, fontWeight:700, lineHeight:1 }}>✕</span>}
                        {(status === "active" || status === "pending") && (
                          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:dotColor, fontWeight:500 }}>{step.num}</span>
                        )}
                      </div>
                      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:labelColor, whiteSpace:"nowrap",
                        fontWeight: status === "active" ? 500 : 400 }}>
                        {step.label}
                      </span>
                    </div>
                    {!isLast && (
                      <div style={{ flex:1, height:1, margin:"0 10px",
                        background: status === "done" ? "#22c55e44" : "#1e293b" }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      <div style={S.main}>

        {/* ══════════════════════════════════════════════════════
            PHASE: HERO
        ══════════════════════════════════════════════════════ */}
        {phase === "hero" && (
          <div className="fade-up">
            <div style={{ textAlign:"center", padding:"60px 0 52px" }}>
              <div style={{ ...S.mono, fontSize:11, color:"#009edb", letterSpacing:"2px", textTransform:"uppercase", marginBottom:20 }}>UN SDG Intelligence Platform</div>
              <h1 style={{ ...S.serif, fontSize:"clamp(36px,5vw,54px)", fontWeight:300, lineHeight:1.1, letterSpacing:"-1px", marginBottom:16 }}>
                Understand any company's<br />
                <em style={{ fontStyle:"italic", color:"#009edb" }}>SDG alignment</em> instantly
              </h1>
              <p style={{ color:"#64748b", fontSize:15, maxWidth:520, margin:"0 auto 28px", lineHeight:1.8 }}>
                Enter an organization name. We read their official sustainability website, extract their goals, and map each one across all 17 UN SDGs — with causal reasoning, trade-off analysis, and concrete recommendations.
              </p>

              {/* Why it matters stats */}
              <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", marginBottom:40 }}>
                {[
                  { stat:"84%", label:"of business leaders say unclear SDG measurement blocks their progress" },
                  { stat:"82%", label:"say limited data quality prevents them from measuring SDG contribution" },
                ].map(({ stat, label }) => (
                  <div key={stat} style={{ ...S.card, padding:"16px 20px", maxWidth:240, textAlign:"left" }}>
                    <div style={{ ...S.serif, fontSize:34, fontWeight:600, color:"#22c55e", lineHeight:1 }}>{stat}</div>
                    <div style={{ fontSize:12, color:"#64748b", marginTop:6, lineHeight:1.5 }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Search */}
              <div style={{ display:"flex", maxWidth:560, margin:"0 auto 14px", background:"#111827", border:"1px solid #243044", borderRadius:10, overflow:"hidden" }}>
                <input value={orgName} onChange={e => setOrgName(e.target.value)}
                  onKeyDown={e => e.key==="Enter" && startFlow()}
                  placeholder="Enter organization name…"
                  style={{ flex:1, background:"transparent", border:"none", color:"#e2e8f0", fontFamily:"'Outfit',sans-serif", fontSize:16, padding:"14px 20px" }} />
                <button onClick={() => startFlow()} style={{ ...S.btnPrimary, borderRadius:0, padding:"14px 28px", fontSize:14 }}>
                  Analyze →
                </button>
              </div>
              <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap", marginBottom:56 }}>
                {["Google","Meta","Amazon","Microsoft"].map(org => (
                  <button key={org} onClick={() => { setOrgName(org); startFlow(org); }}
                    style={{ ...S.btnGhost, borderRadius:99 }}>{org}</button>
                ))}
              </div>

              {/* SDG reference strip */}
              <div style={{ textAlign:"left" }}>
                <div style={{ ...S.mono, fontSize:11, color:"#475569", letterSpacing:"2px", textTransform:"uppercase", marginBottom:14 }}>
                  The 17 UN Sustainable Development Goals — click any to learn more
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {SDGS.map(sdg => (
                    <button key={sdg.id} onClick={() => setPopoverSDG(sdg)}
                      style={{ background:`${sdg.color}18`, border:`1px solid ${sdg.color}44`, borderRadius:6,
                               padding:"5px 10px", cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:sdg.color }} />
                      <span style={{ ...S.mono, fontSize:10, color:sdg.color }}>{sdg.id}</span>
                      <span style={{ fontSize:11, color:"#94a3b8" }}>{sdg.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            PHASE: URL CONFIRMATION
        ══════════════════════════════════════════════════════ */}
        {phase === "url" && (
          <div className="fade-up" style={{ maxWidth:680, margin:"60px auto 0" }}>
            <div style={{ ...S.card, padding:"28px 32px" }}>
              <div style={{ ...S.mono, fontSize:11, color:"#009edb", letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:12 }}>Step 1 — Authoritative Source</div>
              <h2 style={{ ...S.serif, fontSize:22, fontWeight:600, marginBottom:8 }}>{orgName}</h2>
              <p style={{ fontSize:14, color:"#64748b", marginBottom:20, lineHeight:1.7 }}>{urlMsg}</p>
              <div style={{ display:"flex", gap:10, marginBottom:14 }}>
                <input value={orgURL} onChange={e => setOrgURL(e.target.value)}
                  placeholder="https://sustainability.example.com"
                  style={{ flex:1, background:"#0b0f1a", border:"1px solid #243044", borderRadius:6, color:"#e2e8f0", fontFamily:"'DM Mono',monospace", fontSize:13, padding:"10px 14px" }} />
                <button style={S.btnPrimary} onClick={confirmURL} disabled={loading}>
                  {loading ? "Reading…" : "Confirm & Extract Goals →"}
                </button>
              </div>
              <div style={{ padding:"10px 14px", background:"#0c2a3d", borderLeft:"3px solid #009edb", borderRadius:"0 6px 6px 0", fontSize:12, color:"#94a3b8" }}>
                <strong style={{ color:"#009edb" }}>Source integrity rule:</strong> Goals will only be extracted from this URL — never from Wikipedia, news articles, or ESG databases.
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            PHASE: GOALS LIST
            User sees all extracted goals and clicks one to analyze.
        ══════════════════════════════════════════════════════ */}
        {phase === "goals" && (
          <div className="fade-up">

            {/* Loading */}
            {loading && (
              <div style={{ ...S.card, padding:"22px 24px", display:"flex", alignItems:"center", gap:16, marginBottom:24, maxWidth:680, margin:"60px auto" }}>
                <div className="spinner" />
                <div>
                  <div style={{ fontWeight:500, marginBottom:4 }}>Reading {orgName} sustainability website…</div>
                  <div style={{ fontSize:13, color:"#64748b" }}>Extracting goals from the official source only. This takes 20–30 seconds.</div>
                </div>
              </div>
            )}

            {error && (
              <div style={{ background:"#450a0a", border:"1px solid #ef4444", borderRadius:10, padding:"16px 20px", fontSize:14, color:"#fca5a5", marginBottom:16 }}>
                {error}
                <button style={{ ...S.btnGhost, marginLeft:16, color:"#fca5a5", borderColor:"#7f1d1d" }} onClick={() => setPhase("url")}>← Try Again</button>
              </div>
            )}

            {!loading && goals.length > 0 && (
              <>
                {/* Page header */}
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24, gap:16, flexWrap:"wrap" }}>
                  <div>
                    <div style={{ ...S.mono, fontSize:11, color:"#64748b", letterSpacing:"2px", textTransform:"uppercase", marginBottom:6 }}>
                      {orgName} · {goals.length} goals extracted
                    </div>
                    <div style={{ ...S.serif, fontSize:26, fontWeight:600 }}>Select a goal to analyze</div>
                    <p style={{ fontSize:13, color:"#64748b", marginTop:6 }}>
                      Click <strong style={{color:"#e2e8f0"}}>Analyze →</strong> on any goal to run the full 5-dimension SDG analysis.
                      Results are cached — re-clicking a goal is instant.
                    </p>
                  </div>
                  <button style={S.btnGhost} onClick={() => setShowAddForm(v => !v)}>+ Add Custom Goal</button>
                </div>

                {/* SDG heatmap — updates as user analyzes more goals */}
                {analyzedCount > 0 && (
                  <div style={{ marginBottom:28 }}>
                    <div style={{ ...S.mono, fontSize:11, color:"#475569", letterSpacing:"2px", textTransform:"uppercase", marginBottom:10 }}>
                      SDG Coverage so far ({analyzedCount} goal{analyzedCount!==1?"s":""} analyzed)
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))", gap:6, marginBottom:10 }}>
                      {SDGS.map(sdg => {
                        const covered = coveredSDGIds.has(sdg.id);
                        return (
                          <button key={sdg.id} onClick={() => setPopoverSDG(sdg)} title={`SDG ${sdg.id}: ${sdg.name}`}
                            style={{ background: covered?`${sdg.color}22`:"#111827", border:`1.5px solid ${covered?sdg.color+"55":"#1e293b"}`,
                                     borderStyle: covered?"solid":"dashed", borderRadius:6, padding:"8px", textAlign:"left",
                                     cursor:"pointer", opacity:covered?1:0.35, transition:"all 0.2s" }}>
                            <div style={{ ...S.mono, fontSize:9, color:covered?sdg.color:"#475569", marginBottom:3 }}>SDG {sdg.id}</div>
                            <div style={{ fontSize:10, fontWeight:600, color:"#e2e8f0", lineHeight:1.3 }}>{sdg.name}</div>
                          </button>
                        );
                      })}
                    </div>
                    {gapSDGs.length > 0 && (
                      <div style={{ background:"#111827", border:"1px solid #1e293b", borderLeft:"4px solid #f59e0b", borderRadius:8, padding:"10px 14px", fontSize:12, color:"#94a3b8" }}>
                        <strong style={{ color:"#f59e0b" }}>⚠ {gapSDGs.length} gaps: </strong>
                        {gapSDGs.map((g,i) => <span key={g.id}><strong style={{color:"#e2e8f0"}}>SDG {g.id}</strong>{i<gapSDGs.length-1?", ":""}</span>)}
                      </div>
                    )}
                  </div>
                )}

                {/* Custom goal form */}
                {showAddForm && (
                  <div style={{ ...S.card, padding:20, marginBottom:12, borderStyle:"dashed" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                      <span style={{ ...S.mono, fontSize:10, color:"#22c55e", background:"#14532d", padding:"2px 8px", borderRadius:3 }}>CUSTOM</span>
                      <span style={{ fontSize:12, color:"#64748b" }}>Not from the official website</span>
                    </div>
                    <textarea value={customText} onChange={e => setCustomText(e.target.value)}
                      placeholder="Describe the sustainability goal…"
                      style={{ width:"100%", background:"#0b0f1a", border:"1px solid #243044", borderRadius:6, color:"#e2e8f0", fontFamily:"'Outfit',sans-serif", fontSize:14, padding:"10px 14px", resize:"vertical", minHeight:72, marginBottom:10 }} />
                    <div style={{ display:"flex", gap:8 }}>
                      <button style={S.btnGreen} onClick={addCustomGoal}>Add Goal</button>
                      <button style={S.btnGhost} onClick={() => setShowAddForm(false)}>Cancel</button>
                    </div>
                  </div>
                )}

                {/* Goal cards — each has an "Analyze →" button */}
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {goals.map(g => {
                    const done  = analysis[g.id] && !analysis[g.id].error;
                    const failed = analysis[g.id]?.error;
                    const primarySDGs = done ? (analysis[g.id].sdgMappings||[]).filter(m=>m.type==="primary") : [];
                    return (
                      <div key={g.id} className="fade-up"
                        style={{ ...S.card, padding:"16px 20px", display:"flex", alignItems:"flex-start", gap:14,
                                 borderColor: done?"#1e3a2e": failed?"#7f1d1d": g.isCustom?"#166534":"#1e293b",
                                 transition:"border-color 0.2s" }}>
                        {/* Type badge */}
                        <span style={{ ...S.mono, fontSize:9, letterSpacing:"1px", textTransform:"uppercase",
                          padding:"3px 7px", borderRadius:3, flexShrink:0, marginTop:2,
                          background: g.isCustom?"#14532d":"#0c2a3d",
                          color: g.isCustom?"#22c55e":"#009edb" }}>
                          {g.isCustom ? "CUSTOM" : g.tier}
                        </span>

                        {/* Content */}
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:14, fontWeight:500, marginBottom:4, lineHeight:1.4 }}>{g.title}</div>
                          <div style={{ ...S.mono, fontSize:11, color:"#475569", marginBottom: done?8:0 }}>
                            {g.isCustom ? "User-added · not from official source"
                              : <span>From: <a href={g.sourceURL} target="_blank" rel="noopener noreferrer">{g.source}</a></span>}
                          </div>
                          {/* Show SDG pills once analyzed */}
                          {done && (
                            <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                              {primarySDGs.map(m => {
                                const sdg = SDGS.find(s=>s.id===m.sdgId);
                                return (
                                  <span key={m.sdgId} style={{ background:`${sdg?.color}22`, border:`1px solid ${sdg?.color}44`,
                                    borderRadius:4, padding:"2px 8px", ...S.mono, fontSize:10, color:sdg?.color }}>
                                    SDG {m.sdgId}
                                  </span>
                                );
                              })}
                              <span style={{ ...S.mono, fontSize:10, color:"#22c55e", marginLeft:4 }}>✓ analyzed</span>
                            </div>
                          )}
                          {failed && <div style={{ fontSize:12, color:"#ef4444", marginTop:4 }}>Analysis failed — click to retry</div>}
                        </div>

                        {/* Actions */}
                        <div style={{ display:"flex", flexDirection:"column", gap:6, alignItems:"flex-end", flexShrink:0 }}>
                          <button onClick={() => analyzeGoal(g)}
                            style={{ ...S.btnPrimary, fontSize:12, padding:"8px 16px",
                                     background: done?"#1e3a2e": failed?"#7f1d1d":"#009edb",
                                     color: done?"#22c55e": "#fff" }}>
                            {done ? "View Analysis →" : failed ? "Retry →" : "Analyze →"}
                          </button>
                          {!done && <button onClick={() => removeGoal(g.id)}
                            style={{ background:"none", border:"none", color:"#475569", cursor:"pointer", fontSize:12, ...S.mono }}>
                            remove
                          </button>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            PHASE: ANALYSIS
            Full 5-dimension view for one goal.
        ══════════════════════════════════════════════════════ */}
        {phase === "analysis" && activeGoal && (
          <div className="fade-up">

            {/* Breadcrumb nav */}
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:28, ...S.mono, fontSize:12, color:"#475569" }}>
              <button onClick={backToGoals} style={{ background:"none", border:"none", color:"#009edb", cursor:"pointer", ...S.mono, fontSize:12, padding:0 }}>
                {orgName} goals
              </button>
              <span>›</span>
              <span style={{ color:"#94a3b8" }}>SDG Analysis</span>
            </div>

            {/* Goal header */}
            <div style={{ ...S.card, padding:"22px 26px", marginBottom:24 }}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                <span style={{ ...S.mono, fontSize:9, letterSpacing:"1px", textTransform:"uppercase",
                  padding:"3px 7px", borderRadius:3, flexShrink:0, marginTop:3,
                  background: activeGoal.isCustom?"#14532d":"#0c2a3d",
                  color: activeGoal.isCustom?"#22c55e":"#009edb" }}>
                  {activeGoal.isCustom ? "CUSTOM" : activeGoal.tier}
                </span>
                <div>
                  <div style={{ ...S.serif, fontSize:20, fontWeight:600, lineHeight:1.3, marginBottom:5 }}>{activeGoal.title}</div>
                  {activeGoal.sourceURL && (
                    <div style={{ ...S.mono, fontSize:11, color:"#475569" }}>
                      Source: <a href={activeGoal.sourceURL} target="_blank" rel="noopener noreferrer">{activeGoal.source}</a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Loading state */}
            {analyzing && (
              <div style={{ ...S.card, padding:"28px 24px", display:"flex", alignItems:"center", gap:16 }}>
                <div className="spinner" />
                <div>
                  <div style={{ fontWeight:500, marginBottom:4 }}>Running SDG analysis…</div>
                  <div style={{ fontSize:13, color:"#64748b" }}>Mapping this goal across all 17 SDGs, identifying trade-offs and generating recommendations. Usually takes 10–15 seconds.</div>
                </div>
              </div>
            )}

            {/* Error state */}
            {!analyzing && a?.error && (
              <div style={{ background:"#450a0a", border:"1px solid #ef4444", borderRadius:10, padding:"20px 24px" }}>
                <div style={{ ...S.mono, fontSize:11, color:"#ef4444", marginBottom:8, letterSpacing:"1px" }}>ANALYSIS FAILED</div>
                <div style={{ fontSize:13, color:"#fca5a5", marginBottom:12, wordBreak:"break-word" }}>{a.error}</div>
                <button style={{ ...S.btnPrimary, background:"#7f1d1d" }} onClick={() => analyzeGoal(activeGoal)}>Retry →</button>
              </div>
            )}

            {/* 5-dimension results */}
            {!analyzing && a && !a.error && (
              <>
                {/* SDG pills summary */}
                <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:20 }}>
                  {(a.sdgMappings||[]).map(m => {
                    const sdg = SDGS.find(s=>s.id===m.sdgId);
                    return (
                      <button key={m.sdgId} onClick={() => setPopoverSDG(sdg)}
                        style={{ background:`${sdg?.color}22`, border:`1px solid ${sdg?.color}55`,
                          borderRadius:6, padding:"5px 12px", cursor:"pointer",
                          display:"flex", alignItems:"center", gap:6 }}>
                        <div style={{ width:8, height:8, borderRadius:"50%", background:sdg?.color }} />
                        <span style={{ ...S.mono, fontSize:11, color:sdg?.color }}>SDG {m.sdgId}</span>
                        <span style={{ fontSize:11, color:"#94a3b8" }}>{m.sdgName}</span>
                        <span style={{ ...S.mono, fontSize:9,
                          color: m.confidence==="High"?"#86efac":m.confidence==="Medium"?"#fcd34d":"#fca5a5" }}>
                          {m.confidence}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Dim 1: SDG Mappings */}
                <DimSection num={1} label="SDG MAPPING WITH REASONING" color="#1e3a5f" textColor="#93c5fd"
                  description="Primary and secondary SDGs mapped to this goal, with confidence levels and causal reasoning."
                  isOpen={!!expandedDims["dim1"]} onToggle={() => toggleDim("dim1")}>
                  {["primary","secondary"].map(type => {
                    const items = (a.sdgMappings||[]).filter(m=>m.type===type);
                    if (!items.length) return null;
                    return (
                      <div key={type}>
                        <div style={{ ...S.mono, fontSize:10, color:"#475569", letterSpacing:"1px", textTransform:"uppercase", marginBottom:8 }}>{type} SDGs</div>
                        {items.map(m => {
                          const sdg = SDGS.find(s=>s.id===m.sdgId);
                          return (
                            <div key={m.sdgId} style={{ ...S.surface2, padding:"12px 14px", marginBottom:8 }}>
                              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, flexWrap:"wrap" }}>
                                <div style={{ width:10, height:10, borderRadius:"50%", background:sdg?.color }} />
                                <span style={{ fontWeight:600, fontSize:14 }}>SDG {m.sdgId} — {m.sdgName}</span>
                                <button onClick={() => setPopoverSDG(sdg)}
                                  style={{ ...S.mono, fontSize:9, color:"#009edb", background:"#0c2a3d", border:"none", borderRadius:3, padding:"1px 6px", cursor:"pointer" }}>
                                  learn more
                                </button>
                                <span style={{ ...S.mono, fontSize:10, padding:"2px 7px", borderRadius:3, marginLeft:"auto",
                                  background:m.confidence==="High"?"#14532d":m.confidence==="Medium"?"#3b2d00":"#450a0a",
                                  color:m.confidence==="High"?"#86efac":m.confidence==="Medium"?"#fcd34d":"#fca5a5" }}>
                                  {m.confidence}
                                </span>
                              </div>
                              <div style={{ fontSize:13, color:"#94a3b8", lineHeight:1.6 }}>{m.reasoning}</div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </DimSection>

                {/* Dim 2: Positive Impacts */}
                <DimSection num={2} label="POSITIVE SDG IMPACT ANALYSIS" color="#14532d" textColor="#86efac"
                  description="Specific SDG targets that this goal advances, with mechanism explanations."
                  isOpen={!!expandedDims["dim2"]} onToggle={() => toggleDim("dim2")}>
                  {!(a.positiveImpacts||[]).length
                    ? <p style={{ fontSize:13, color:"#475569" }}>No specific positive impacts identified.</p>
                    : (a.positiveImpacts||[]).map((imp,i) => (
                      <div key={i} style={{ ...S.surface2, borderLeft:"3px solid #22c55e", padding:"10px 14px", marginBottom:8 }}>
                        <div style={{ ...S.mono, fontSize:11, color:"#64748b", marginBottom:3 }}>
                          Target {imp.targetId}{imp.indicator ? ` · ${imp.indicator}` : ""}
                        </div>
                        <div style={{ fontSize:12, color:"#93c5fd", fontStyle:"italic", marginBottom:5 }}>{imp.targetText}</div>
                        <div style={{ fontSize:13, color:"#94a3b8", lineHeight:1.6 }}>{imp.mechanism}</div>
                      </div>
                    ))
                  }
                </DimSection>

                {/* Dim 3: Trade-offs */}
                <DimSection num={3} label="NEGATIVE TRADE-OFF ANALYSIS" color="#7f1d1d" textColor="#fca5a5"
                  description="Tensions and unintended harms across other SDGs, rated by severity."
                  isOpen={!!expandedDims["dim3"]} onToggle={() => toggleDim("dim3")}>
                  <div style={{ background:"#0c2a3d", borderLeft:"3px solid #009edb", padding:"8px 12px", borderRadius:"0 6px 6px 0", fontSize:12, color:"#94a3b8", marginBottom:12 }}>
                    Surfacing trade-offs helps leaders design more robust programs — not to criticize, but to strengthen.
                  </div>
                  {!(a.negativeTradeoffs||[]).length
                    ? <p style={{ fontSize:13, color:"#475569" }}>No significant trade-offs identified for this goal.</p>
                    : (a.negativeTradeoffs||[]).map((t,i) => {
                      const sev = (t.severity||"").toLowerCase();
                      return (
                        <div key={i} style={{ ...S.surface2, borderLeft:"3px solid #ef4444", padding:"10px 14px", marginBottom:8 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3, flexWrap:"wrap" }}>
                            <span style={{ ...S.mono, fontSize:11, color:"#64748b" }}>Target {t.targetId}</span>
                            <span style={{ ...S.mono, fontSize:9, padding:"2px 6px", borderRadius:3, textTransform:"uppercase",
                              background:sev.includes("significant")?"#450a0a":sev.includes("moderate")?"#3b2d00":"#1c2537",
                              color:sev.includes("significant")?"#ef4444":sev.includes("moderate")?"#f59e0b":"#64748b" }}>
                              {t.severity}
                            </span>
                          </div>
                          <div style={{ fontSize:12, color:"#fca5a5", fontStyle:"italic", marginBottom:5 }}>{t.targetText}</div>
                          <div style={{ fontSize:13, color:"#94a3b8", lineHeight:1.6 }}>{t.mechanism}</div>
                        </div>
                      );
                    })
                  }
                </DimSection>

                {/* Dim 4: Targets table */}
                <DimSection num={4} label="SDG TARGETS & INDICATORS" color="#3b2d00" textColor="#fcd34d"
                  description="Combined table of all affected SDG targets with impact direction and indicator codes."
                  isOpen={!!expandedDims["dim4"]} onToggle={() => toggleDim("dim4")}>
                  {!(a.targetsTable||[]).length
                    ? <p style={{ fontSize:13, color:"#475569" }}>No targets table available.</p>
                    : (
                      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                        <thead>
                          <tr>{["Target","Description","Impact","Indicator"].map(h => (
                            <th key={h} style={{ ...S.mono, fontSize:10, color:"#475569", textAlign:"left", padding:"6px 8px", borderBottom:"1px solid #1e293b", letterSpacing:"1px", textTransform:"uppercase" }}>{h}</th>
                          ))}</tr>
                        </thead>
                        <tbody>
                          {a.targetsTable.map((t,i) => (
                            <tr key={i} style={{ background:i%2===0?"transparent":"rgba(255,255,255,0.02)" }}>
                              <td style={{ ...S.mono, fontSize:11, color:"#009edb", padding:"10px 8px", verticalAlign:"top", whiteSpace:"nowrap" }}>{t.targetId}</td>
                              <td style={{ fontSize:12, color:"#94a3b8", padding:"10px 8px", lineHeight:1.5 }}>{t.targetText}</td>
                              <td style={{ padding:"10px 8px", textAlign:"center", fontSize:15 }}>
                                <span style={{ color:t.direction==="positive"?"#22c55e":"#ef4444" }}>{t.direction==="positive"?"▲":"▼"}</span>
                              </td>
                              <td style={{ ...S.mono, fontSize:11, color:"#475569", padding:"10px 8px" }}>{t.indicator||"—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )
                  }
                </DimSection>

                {/* Dim 5: Recommendations */}
                <DimSection num={5} label="RECOMMENDATIONS" color="#2d1b5e" textColor="#c4b5fd"
                  description="Specific, actionable next steps referencing concrete SDG indicators and program types."
                  isOpen={!!expandedDims["dim5"]} onToggle={() => toggleDim("dim5")}>
                  {!(a.recommendations||[]).length
                    ? <p style={{ fontSize:13, color:"#475569" }}>No recommendations available.</p>
                    : (a.recommendations||[]).map((r,i) => (
                      <div key={i} style={{ ...S.surface2, borderLeft:"3px solid #7c3aed", padding:"10px 14px", marginBottom:8 }}>
                        <div style={{ ...S.mono, fontSize:10, color:"#a78bfa", marginBottom:4 }}>REC {i+1}</div>
                        <div style={{ fontSize:13, color:"#94a3b8", lineHeight:1.7 }}>{r}</div>
                      </div>
                    ))
                  }
                </DimSection>

                {/* Bottom nav */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8, paddingTop:24, borderTop:"1px solid #1e293b" }}>
                  <button style={S.btnGhost} onClick={backToGoals}>← Back to all goals</button>
                  <button style={S.btnGreen} onClick={exportCSV}>⬇ Export analyzed goals CSV</button>
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

// Helper: Collapsible dimension section wrapper
const DimSection = ({ num, label, color, textColor, children, description, isOpen, onToggle }) => (
  <div style={{ ...S.card, marginBottom:10, borderLeft:`4px solid ${color}`, overflow:"hidden" }}>
    {/* Header — always visible, click to expand/collapse */}
    <button onClick={onToggle}
      style={{ width:"100%", background:"none", border:"none", cursor:"pointer",
               padding:"16px 20px", display:"flex", alignItems:"center", gap:10, textAlign:"left" }}>
      <div style={{ width:22, height:22, borderRadius:"50%", background:color, color:textColor,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontFamily:"'DM Mono',monospace", fontSize:11, fontWeight:500, flexShrink:0 }}>
        {num}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, fontWeight:500, color:"#94a3b8", letterSpacing:"0.5px", display:"block" }}>
          {label}
        </span>
        {!isOpen && description && (
          <span style={{ fontFamily:"'Outfit',sans-serif", fontSize:12, color:"#475569", display:"block", marginTop:2 }}>
            {description}
          </span>
        )}
      </div>
      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"#475569", flexShrink:0, transition:"transform 0.2s",
                     transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", display:"inline-block" }}>▼</span>
    </button>
    {/* Collapsible body */}
    {isOpen && (
      <div style={{ padding:"4px 20px 20px", borderTop:"1px solid #1e293b" }}>
        {children}
      </div>
    )}
  </div>
);

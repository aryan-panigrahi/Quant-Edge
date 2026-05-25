import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';
import { Activity, Target, Brain, Lock, RefreshCw, Zap, Globe, Info, ChevronUp, ChevronDown, TerminalSquare } from 'lucide-react';

const POPULAR_TICKERS = [
  { symbol: 'RELIANCE.NS', name: 'RELIANCE' },
  { symbol: 'HDFCBANK.NS', name: 'HDFCBANK' },
  { symbol: 'BHARTIARTL.NS', name: 'BHARTIARTL' },
  { symbol: 'SBIN.NS', name: 'SBIN' },
  { symbol: 'TCS.NS', name: 'TCS' },
  { symbol: 'ICICIBANK.NS', name: 'ICICIBANK' },
  { symbol: 'BAJFINANCE.NS', name: 'BAJFINANCE' },
  { symbol: 'HINDUNILVR.NS', name: 'HINDUNILVR' },
  { symbol: 'INFY.NS', name: 'INFY' },
  { symbol: 'LT.NS', name: 'LT' },
  { symbol: 'LICI.NS', name: 'LICI' },
  { symbol: 'MARUTI.NS', name: 'MARUTI' },
  { symbol: 'SUNPHARMA.NS', name: 'SUNPHARMA' },
  { symbol: 'AXISBANK.NS', name: 'AXISBANK' },
  { symbol: 'HCLTECH.NS', name: 'HCLTECH' },
  { symbol: 'TITAN.NS', name: 'TITAN' },
  { symbol: 'ITC.NS', name: 'ITC' },
  { symbol: 'KOTAKBANK.NS', name: 'KOTAKBANK' },
  { symbol: 'NTPC.NS', name: 'NTPC' },
  { symbol: 'ONGC.NS', name: 'ONGC' },
  { symbol: 'M_M.NS', name: 'M_M' },
  { symbol: 'ULTRACEMCO.NS', name: 'ULTRACEMCO' },
  { symbol: 'ADANIPORTS.NS', name: 'ADANIPORTS' },
  { symbol: 'ADANIPOWER.NS', name: 'ADANIPOWER' },
  { symbol: 'BEL.NS', name: 'BEL' },
  { symbol: 'COALINDIA.NS', name: 'COALINDIA' },
  { symbol: 'JSWSTEEL.NS', name: 'JSWSTEEL' },
  { symbol: 'DMART.NS', name: 'DMART' },
  { symbol: 'VEDL.NS', name: 'VEDL' },
  { symbol: 'BAJAJFINSV.NS', name: 'BAJAJFINSV' },
  { symbol: 'POWERGRID.NS', name: 'POWERGRID' },
  { symbol: 'HAL.NS', name: 'HAL' },
  { symbol: 'BAJAJ_AUTO.NS', name: 'BAJAJ_AUTO' },
  { symbol: 'ADANIENT.NS', name: 'ADANIENT' },
  { symbol: 'TATASTEEL.NS', name: 'TATASTEEL' },
  { symbol: 'NESTLEIND.NS', name: 'NESTLEIND' },
  { symbol: 'HINDZINC.NS', name: 'HINDZINC' },
  { symbol: 'HINDALCO.NS', name: 'HINDALCO' },
  { symbol: 'ASIANPAINT.NS', name: 'ASIANPAINT' },
  { symbol: 'ETERNAL.NS', name: 'ETERNAL' },
  { symbol: 'WIPRO.NS', name: 'WIPRO' },
  { symbol: 'EICHERMOT.NS', name: 'EICHERMOT' },
  { symbol: 'IOC.NS', name: 'IOC' },
  { symbol: 'SBILIFE.NS', name: 'SBILIFE' },
  { symbol: 'SHRIRAMFIN.NS', name: 'SHRIRAMFIN' },
  { symbol: 'GRASIM.NS', name: 'GRASIM' },
  { symbol: 'TVSMOTOR.NS', name: 'TVSMOTOR' },
  { symbol: 'ADANIGREEN.NS', name: 'ADANIGREEN' },
  { symbol: 'INDIGO.NS', name: 'INDIGO' },
  { symbol: 'ICICIAMC.NS', name: 'ICICIAMC' },
  { symbol: 'DIVISLAB.NS', name: 'DIVISLAB' },
  { symbol: 'TMCV.NS', name: 'TMCV' },
  { symbol: 'JIOFIN.NS', name: 'JIOFIN' },
  { symbol: 'HYUNDAI.NS', name: 'HYUNDAI' },
  { symbol: 'VBL.NS', name: 'VBL' },
  { symbol: 'BANKBARODA.NS', name: 'BANKBARODA' },
  { symbol: 'PFC.NS', name: 'PFC' },
  { symbol: 'UNIONBANK.NS', name: 'UNIONBANK' },
  { symbol: 'ABB.NS', name: 'ABB' },
  { symbol: 'MUTHOOTFIN.NS', name: 'MUTHOOTFIN' },
  { symbol: 'DLF.NS', name: 'DLF' },
  { symbol: 'TORNTPHARM.NS', name: 'TORNTPHARM' },
  { symbol: 'TATACAP.NS', name: 'TATACAP' },
  { symbol: 'PIDILITIND.NS', name: 'PIDILITIND' },
  { symbol: 'TRENT.NS', name: 'TRENT' },
  { symbol: 'CUMMINSIND.NS', name: 'CUMMINSIND' },
  { symbol: 'LTM.NS', name: 'LTM' },
  { symbol: 'BSE.NS', name: 'BSE' },
  { symbol: 'BRITANNIA.NS', name: 'BRITANNIA' },
  { symbol: 'CHOLAFIN.NS', name: 'CHOLAFIN' },
  { symbol: 'ADANIENSOL.NS', name: 'ADANIENSOL' },
  { symbol: 'TECHM.NS', name: 'TECHM' },
  { symbol: 'BPCL.NS', name: 'BPCL' },
  { symbol: 'IRFC.NS', name: 'IRFC' },
  { symbol: 'HDFCLIFE.NS', name: 'HDFCLIFE' },
  { symbol: 'INDIANB.NS', name: 'INDIANB' },
  { symbol: 'TATAPOWER.NS', name: 'TATAPOWER' },
  { symbol: 'SOLARINDS.NS', name: 'SOLARINDS' },
  { symbol: 'PNB.NS', name: 'PNB' },
  { symbol: 'CANBK.NS', name: 'CANBK' },
  { symbol: 'MOTHERSON.NS', name: 'MOTHERSON' },
  { symbol: 'TMPV.NS', name: 'TMPV' },
  { symbol: 'JINDALSTEL.NS', name: 'JINDALSTEL' },
  { symbol: 'POWERINDIA.NS', name: 'POWERINDIA' },
  { symbol: 'GROWW.NS', name: 'GROWW' },
  { symbol: 'INDUSTOWER.NS', name: 'INDUSTOWER' },
  { symbol: 'SIEMENS.NS', name: 'SIEMENS' },
  { symbol: 'POLYCAB.NS', name: 'POLYCAB' },
  { symbol: 'CGPOWER.NS', name: 'CGPOWER' },
  { symbol: 'BAJAJHLDNG.NS', name: 'BAJAJHLDNG' },
  { symbol: 'GODREJCP.NS', name: 'GODREJCP' },
  { symbol: 'BOSCHLTD.NS', name: 'BOSCHLTD' },
  { symbol: 'HDFCAMC.NS', name: 'HDFCAMC' },
  { symbol: 'APOLLOHOSP.NS', name: 'APOLLOHOSP' },
  { symbol: 'AMBUJACEM.NS', name: 'AMBUJACEM' },
  { symbol: 'TATACONSUM.NS', name: 'TATACONSUM' },
  { symbol: 'HEROMOTOCO.NS', name: 'HEROMOTOCO' },
  { symbol: 'LUPIN.NS', name: 'LUPIN' },
  { symbol: 'DRREDDY.NS', name: 'DRREDDY' },
  { symbol: 'GET_D.NS', name: 'GET_D' },
  { symbol: 'GVT_D.NS', name: 'GVT_D' },
  { symbol: 'GAIL.NS', name: 'GAIL' },
  { symbol: 'ASHOKLEY.NS', name: 'ASHOKLEY' },
  { symbol: 'GMRAIRPORT.NS', name: 'GMRAIRPORT' },
  { symbol: 'CIPLA.NS', name: 'CIPLA' },
  { symbol: 'IDEA.NS', name: 'IDEA' },
  { symbol: 'ENRIN.NS', name: 'ENRIN' },
  { symbol: 'MAZDOCK.NS', name: 'MAZDOCK' },
  { symbol: 'LGEINDIA.NS', name: 'LGEINDIA' },
  { symbol: 'MARICO.NS', name: 'MARICO' },
  { symbol: 'BHEL.NS', name: 'BHEL' },
  { symbol: 'WAAREEENER.NS', name: 'WAAREEENER' },
  { symbol: 'MAXHEALTH.NS', name: 'MAXHEALTH' },
  { symbol: 'RECLTD.NS', name: 'RECLTD' },
  { symbol: 'ZYDUSLIFE.NS', name: 'ZYDUSLIFE' },
  { symbol: 'INDHOTEL.NS', name: 'INDHOTEL' },
  { symbol: 'LENSKART.NS', name: 'LENSKART' },
  { symbol: 'UNITDSPR.NS', name: 'UNITDSPR' },
  { symbol: 'ICICIGI.NS', name: 'ICICIGI' },
  { symbol: 'ABCAPITAL.NS', name: 'ABCAPITAL' },
  { symbol: 'SHREECEM.NS', name: 'SHREECEM' },
  { symbol: 'JSWENERGY.NS', name: 'JSWENERGY' },
  { symbol: 'MANKIND.NS', name: 'MANKIND' },
  { symbol: 'LLOYDSME.NS', name: 'LLOYDSME' },
  { symbol: 'BHARATFORG.NS', name: 'BHARATFORG' },
  { symbol: 'PERSISTENT.NS', name: 'PERSISTENT' },
  { symbol: 'NTPCGREEN.NS', name: 'NTPCGREEN' },
  { symbol: 'LODHA.NS', name: 'LODHA' },
  { symbol: 'HAVELLS.NS', name: 'HAVELLS' },
  { symbol: 'ICICIPRULI.NS', name: 'ICICIPRULI' },
  { symbol: 'AUROPHARMA.NS', name: 'AUROPHARMA' },
  { symbol: 'IDBI.NS', name: 'IDBI' },
  { symbol: 'NHPC.NS', name: 'NHPC' },
  { symbol: 'OIL.NS', name: 'OIL' },
  { symbol: 'BHARTIHEXA.NS', name: 'BHARTIHEXA' },
  { symbol: 'HINDPETRO.NS', name: 'HINDPETRO' },
  { symbol: 'DABUR.NS', name: 'DABUR' },
  { symbol: 'NATIONALUM.NS', name: 'NATIONALUM' },
  { symbol: 'MEESHO.NS', name: 'MEESHO' },
  { symbol: 'NMDC.NS', name: 'NMDC' },
  { symbol: 'NYKAA.NS', name: 'NYKAA' },
  { symbol: 'TORNTPOWER.NS', name: 'TORNTPOWER' },
  { symbol: 'AUBANK.NS', name: 'AUBANK' },
  { symbol: 'SRF.NS', name: 'SRF' },
  { symbol: 'SWIGGY.NS', name: 'SWIGGY' },
  { symbol: 'PAYTM.NS', name: 'PAYTM' },
  { symbol: 'BAJAJHFL.NS', name: 'BAJAJHFL' },
  { symbol: 'FEDERALBNK.NS', name: 'FEDERALBNK' },
  { symbol: 'POLICYBZR.NS', name: 'POLICYBZR' },
  { symbol: 'GICRE.NS', name: 'GICRE' },
  { symbol: 'MCX.NS', name: 'MCX' },
  { symbol: 'LTF.NS', name: 'LTF' },
  { symbol: 'SAIL.NS', name: 'SAIL' },
  { symbol: 'BANKINDIA.NS', name: 'BANKINDIA' },
  { symbol: 'IOB.NS', name: 'IOB' },
  { symbol: 'NAUKRI.NS', name: 'NAUKRI' },
  { symbol: 'DIXON.NS', name: 'DIXON' },
  { symbol: 'ALKEM.NS', name: 'ALKEM' },
  { symbol: 'FORTIS.NS', name: 'FORTIS' },
  { symbol: 'SBICARD.NS', name: 'SBICARD' },
  { symbol: 'INDUSINDBK.NS', name: 'INDUSINDBK' },
  { symbol: 'COROMANDEL.NS', name: 'COROMANDEL' },
  { symbol: 'OFSS.NS', name: 'OFSS' },
  { symbol: 'JSL.NS', name: 'JSL' },
  { symbol: 'LINDEINDIA.NS', name: 'LINDEINDIA' },
  { symbol: 'GLENMARK.NS', name: 'GLENMARK' },
  { symbol: 'PHOENIXLTD.NS', name: 'PHOENIXLTD' },
  { symbol: 'UNOMINDA.NS', name: 'UNOMINDA' },
  { symbol: 'SUZLON.NS', name: 'SUZLON' },
  { symbol: 'ATGL.NS', name: 'ATGL' },
  { symbol: 'OBEROIRLTY.NS', name: 'OBEROIRLTY' },
  { symbol: 'SCHAEFFLER.NS', name: 'SCHAEFFLER' },
  { symbol: 'YESBANK.NS', name: 'YESBANK' },
  { symbol: 'LAURUSLABS.NS', name: 'LAURUSLABS' },
  { symbol: 'RVNL.NS', name: 'RVNL' },
  { symbol: 'MRF.NS', name: 'MRF' },
  { symbol: 'PRESTIGE.NS', name: 'PRESTIGE' },
  { symbol: 'APLAPOLLO.NS', name: 'APLAPOLLO' },
  { symbol: 'IDFCFIRSTB.NS', name: 'IDFCFIRSTB' },
  { symbol: 'BIOCON.NS', name: 'BIOCON' },
  { symbol: 'FACT.NS', name: 'FACT' },
  { symbol: 'MFSL.NS', name: 'MFSL' },
  { symbol: 'ABBOTINDIA.NS', name: 'ABBOTINDIA' },
  { symbol: 'SUNDARMFIN.NS', name: 'SUNDARMFIN' },
  { symbol: 'UPL.NS', name: 'UPL' },
  { symbol: 'UPLPP1.NS', name: 'UPLPP1' },
  { symbol: 'MAHABANK.NS', name: 'MAHABANK' },
  { symbol: 'JSWINFRA.NS', name: 'JSWINFRA' },
  { symbol: 'TIINDIA.NS', name: 'TIINDIA' },
  { symbol: 'VMM.NS', name: 'VMM' },
  { symbol: 'COLPAL.NS', name: 'COLPAL' },
  { symbol: 'HDBFS.NS', name: 'HDBFS' },
  { symbol: 'GODREJPROP.NS', name: 'GODREJPROP' },
  { symbol: 'BERGEPAINT.NS', name: 'BERGEPAINT' },
  { symbol: 'KRT.NS', name: 'KRT' },
  { symbol: 'HINDCOPPER.NS', name: 'HINDCOPPER' },
  { symbol: 'PATANJALI.NS', name: 'PATANJALI' },
  { symbol: 'BDL.NS', name: 'BDL' },
  { symbol: 'SUPREMEIND.NS', name: 'SUPREMEIND' },
  { symbol: 'KALYANKJIL.NS', name: 'KALYANKJIL' },
  { symbol: 'MOTILALOFS.NS', name: 'MOTILALOFS' },
  { symbol: 'MPHASIS.NS', name: 'MPHASIS' },
  { symbol: 'PIIND.NS', name: 'PIIND' },
  { symbol: 'PREMIERENE.NS', name: 'PREMIERENE' },
  { symbol: 'APARINDS.NS', name: 'APARINDS' },
  { symbol: 'BALKRISIND.NS', name: 'BALKRISIND' },
  { symbol: 'JKCEMENT.NS', name: 'JKCEMENT' },
  { symbol: 'IRCTC.NS', name: 'IRCTC' },
  { symbol: 'VOLTAS.NS', name: 'VOLTAS' },
  { symbol: 'COFORGE.NS', name: 'COFORGE' },
  { symbol: 'KEI.NS', name: 'KEI' },
  { symbol: 'ASTRAL.NS', name: 'ASTRAL' },
  { symbol: 'TATACOMM.NS', name: 'TATACOMM' },
  { symbol: 'EMBASSY.NS', name: 'EMBASSY' },
  { symbol: 'M_MFIN.NS', name: 'M_MFIN' },
  { symbol: 'PETRONET.NS', name: 'PETRONET' },
  { symbol: '360ONE.NS', name: '360ONE' },
  { symbol: 'ANTHEM.NS', name: 'ANTHEM' },
  { symbol: 'PAGEIND.NS', name: 'PAGEIND' },
  { symbol: 'GLAXO.NS', name: 'GLAXO' },
  { symbol: 'THERMAX.NS', name: 'THERMAX' },
  { symbol: 'PIRAMALFIN.NS', name: 'PIRAMALFIN' },
  { symbol: 'UBL.NS', name: 'UBL' },
  { symbol: 'COCHINSHIP.NS', name: 'COCHINSHIP' },
  { symbol: 'NLCINDIA.NS', name: 'NLCINDIA' },
  { symbol: 'IPCALAB.NS', name: 'IPCALAB' },
  { symbol: 'CONCOR.NS', name: 'CONCOR' },
  { symbol: 'AIIL.NS', name: 'AIIL' },
  { symbol: 'HUDCO.NS', name: 'HUDCO' },
  { symbol: 'RADICO.NS', name: 'RADICO' },
  { symbol: 'FLUOROCHEM.NS', name: 'FLUOROCHEM' },
  { symbol: 'DALBHARAT.NS', name: 'DALBHARAT' },
  { symbol: 'LTTS.NS', name: 'LTTS' },
  { symbol: 'DELHIVERY.NS', name: 'DELHIVERY' },
  { symbol: 'NH.NS', name: 'NH' },
  { symbol: 'ESCORTS.NS', name: 'ESCORTS' },
  { symbol: '3MINDIA.NS', name: '3MINDIA' },
  { symbol: 'IREDA.NS', name: 'IREDA' },
  { symbol: 'ASTERDM.NS', name: 'ASTERDM' },
  { symbol: 'AJANTPHARM.NS', name: 'AJANTPHARM' },
  { symbol: 'BLUESTARCO.NS', name: 'BLUESTARCO' },
  { symbol: 'AIAENG.NS', name: 'AIAENG' },
  { symbol: 'ENDURANCE.NS', name: 'ENDURANCE' },
  { symbol: 'POONAWALLA.NS', name: 'POONAWALLA' },
  { symbol: 'SONACOMS.NS', name: 'SONACOMS' },
  { symbol: 'UCOBANK.NS', name: 'UCOBANK' },
  { symbol: 'TATAINVEST.NS', name: 'TATAINVEST' },
  { symbol: 'GODFRYPHLP.NS', name: 'GODFRYPHLP' },
  { symbol: 'CENTRALBK.NS', name: 'CENTRALBK' },
  { symbol: 'JBCHEPHARM.NS', name: 'JBCHEPHARM' },
  { symbol: 'ITCHOTELS.NS', name: 'ITCHOTELS' },
  { symbol: 'NAVINFLUOR.NS', name: 'NAVINFLUOR' },
  { symbol: 'PGHH.NS', name: 'PGHH' },
  { symbol: 'ATHERENERG.NS', name: 'ATHERENERG' },
  { symbol: 'MINDSPACE.NS', name: 'MINDSPACE' },
  { symbol: 'MRPL.NS', name: 'MRPL' },
  { symbol: 'EMCURE.NS', name: 'EMCURE' },
  { symbol: 'CHOLAHLDNG.NS', name: 'CHOLAHLDNG' },
  { symbol: 'ANANDRATHI.NS', name: 'ANANDRATHI' },
  { symbol: 'GODIGIT.NS', name: 'GODIGIT' },
  { symbol: 'GODREJIND.NS', name: 'GODREJIND' },
  { symbol: 'KPRMILL.NS', name: 'KPRMILL' },
  { symbol: 'LICHSGFIN.NS', name: 'LICHSGFIN' },
  { symbol: 'FORCEMOT.NS', name: 'FORCEMOT' },
  { symbol: 'HEXT.NS', name: 'HEXT' },
  { symbol: 'PWL.NS', name: 'PWL' },
  { symbol: 'GRSE.NS', name: 'GRSE' },
  { symbol: 'GLAND.NS', name: 'GLAND' },
  { symbol: 'CRISIL.NS', name: 'CRISIL' },
  { symbol: 'ITI.NS', name: 'ITI' },
  { symbol: 'MEDANTA.NS', name: 'MEDANTA' },
  { symbol: 'TVSHLTD.NS', name: 'TVSHLTD' },
  { symbol: 'JUBLFOOD.NS', name: 'JUBLFOOD' },
  { symbol: 'APOLLOTYRE.NS', name: 'APOLLOTYRE' },
  { symbol: 'ABSLAMC.NS', name: 'ABSLAMC' },
  { symbol: 'SJVN.NS', name: 'SJVN' },
  { symbol: 'TATAELXSI.NS', name: 'TATAELXSI' },
  { symbol: 'STARHEALTH.NS', name: 'STARHEALTH' },
  { symbol: 'METROBRAND.NS', name: 'METROBRAND' },
  { symbol: 'ZFCVINDIA.NS', name: 'ZFCVINDIA' },
  { symbol: 'KARURVYSYA.NS', name: 'KARURVYSYA' },
  { symbol: 'CDSL.NS', name: 'CDSL' },
  { symbol: 'BANDHANBNK.NS', name: 'BANDHANBNK' },
  { symbol: 'KIMS.NS', name: 'KIMS' },
  { symbol: 'EXIDEIND.NS', name: 'EXIDEIND' },
  { symbol: 'ACC.NS', name: 'ACC' },
  { symbol: 'TIMKEN.NS', name: 'TIMKEN' },
  { symbol: 'KAYNES.NS', name: 'KAYNES' },
  { symbol: 'ANGELONE.NS', name: 'ANGELONE' },
  { symbol: 'MSUMI.NS', name: 'MSUMI' },
  { symbol: 'IKS.NS', name: 'IKS' },
  { symbol: 'BIRET.NS', name: 'BIRET' },
  { symbol: 'IRB.NS', name: 'IRB' },
  { symbol: 'WELCORP.NS', name: 'WELCORP' },
  { symbol: 'GILLETTE.NS', name: 'GILLETTE' },
  { symbol: 'PFOCUS.NS', name: 'PFOCUS' },
  { symbol: 'HONAUT.NS', name: 'HONAUT' },
  { symbol: 'AMBER.NS', name: 'AMBER' },
  { symbol: 'NXST.NS', name: 'NXST' },
  { symbol: 'NBCC.NS', name: 'NBCC' },
  { symbol: 'NUVAMA.NS', name: 'NUVAMA' },
  { symbol: 'HSCL.NS', name: 'HSCL' },
  { symbol: 'LALPATHLAB.NS', name: 'LALPATHLAB' },
  { symbol: 'SUNTV.NS', name: 'SUNTV' },
  { symbol: 'SHYAMMETL.NS', name: 'SHYAMMETL' },
  { symbol: 'PTCIL.NS', name: 'PTCIL' },
  { symbol: 'RAMCOCEM.NS', name: 'RAMCOCEM' },
  { symbol: 'SCHNEIDER.NS', name: 'SCHNEIDER' },
  { symbol: 'AWL.NS', name: 'AWL' },
  { symbol: 'TATATECH.NS', name: 'TATATECH' },
  { symbol: 'PNBHOUSING.NS', name: 'PNBHOUSING' },
  { symbol: 'TENNIND.NS', name: 'TENNIND' },
  { symbol: 'CPPLUS.NS', name: 'CPPLUS' },
  { symbol: 'MANAPPURAM.NS', name: 'MANAPPURAM' },
  { symbol: 'WOCKPHARMA.NS', name: 'WOCKPHARMA' },
  { symbol: 'GUJGASLTD.NS', name: 'GUJGASLTD' },
  { symbol: 'ASAHIINDIA.NS', name: 'ASAHIINDIA' },
  { symbol: 'PFIZER.NS', name: 'PFIZER' },
  { symbol: 'IGL.NS', name: 'IGL' },
  { symbol: 'BAYERCROP.NS', name: 'BAYERCROP' },
  { symbol: 'NIACL.NS', name: 'NIACL' },
  { symbol: 'KIOCL.NS', name: 'KIOCL' },
  { symbol: 'AEGISLOG.NS', name: 'AEGISLOG' },
  { symbol: 'KIRLOSENG.NS', name: 'KIRLOSENG' },
  { symbol: 'CESC.NS', name: 'CESC' },
  { symbol: 'AEGISVOPAK.NS', name: 'AEGISVOPAK' },
  { symbol: 'SUMICHEM.NS', name: 'SUMICHEM' },
  { symbol: 'SAILIFE.NS', name: 'SAILIFE' },
  { symbol: 'AADHARHFC.NS', name: 'AADHARHFC' },
  { symbol: 'HATSUN.NS', name: 'HATSUN' },
  { symbol: 'ASTRAZEN.NS', name: 'ASTRAZEN' },
  { symbol: 'NATCOPHARM.NS', name: 'NATCOPHARM' },
  { symbol: 'HBLENGINE.NS', name: 'HBLENGINE' },
  { symbol: 'SAGILITY.NS', name: 'SAGILITY' },
  { symbol: 'GESHIP.NS', name: 'GESHIP' },
  { symbol: 'CREDITACC.NS', name: 'CREDITACC' },
  { symbol: 'RBLBANK.NS', name: 'RBLBANK' },
  { symbol: 'AFFLE.NS', name: 'AFFLE' },
  { symbol: 'URBANCO.NS', name: 'URBANCO' },
  { symbol: 'PINELABS.NS', name: 'PINELABS' },
  { symbol: 'KPIL.NS', name: 'KPIL' },
  { symbol: 'KPITTECH.NS', name: 'KPITTECH' },
  { symbol: 'SARDAEN.NS', name: 'SARDAEN' },
  { symbol: 'EIHOTEL.NS', name: 'EIHOTEL' },
  { symbol: 'DEEPAKNTR.NS', name: 'DEEPAKNTR' },
  { symbol: 'GMDCLTD.NS', name: 'GMDCLTD' },
  { symbol: 'GPIL.NS', name: 'GPIL' },
  { symbol: 'NETWEB.NS', name: 'NETWEB' },
  { symbol: 'ACUTAAS.NS', name: 'ACUTAAS' },
  { symbol: 'PPLPHARMA.NS', name: 'PPLPHARMA' },
  { symbol: 'ATUL.NS', name: 'ATUL' },
  { symbol: 'NEULANDLAB.NS', name: 'NEULANDLAB' },
  { symbol: 'ERIS.NS', name: 'ERIS' },
  { symbol: 'DATAPATTNS.NS', name: 'DATAPATTNS' },
  { symbol: 'IIFL.NS', name: 'IIFL' },
  { symbol: 'CUB.NS', name: 'CUB' },
  { symbol: 'JYOTICNC.NS', name: 'JYOTICNC' },
  { symbol: 'EMAMILTD.NS', name: 'EMAMILTD' },
  { symbol: 'CHAMBLFERT.NS', name: 'CHAMBLFERT' },
  { symbol: 'CIEINDIA.NS', name: 'CIEINDIA' },
  { symbol: 'BELRISE.NS', name: 'BELRISE' },
  { symbol: 'CASTROLIND.NS', name: 'CASTROLIND' },
  { symbol: 'DCMSHRIRAM.NS', name: 'DCMSHRIRAM' },
  { symbol: 'CRAFTSMAN.NS', name: 'CRAFTSMAN' },
  { symbol: 'AVANTIFEED.NS', name: 'AVANTIFEED' },
  { symbol: 'KAJARIACER.NS', name: 'KAJARIACER' },
  { symbol: 'CAMS.NS', name: 'CAMS' },
  { symbol: 'JSWCEMENT.NS', name: 'JSWCEMENT' },
  { symbol: 'ANANTRAJ.NS', name: 'ANANTRAJ' },
  { symbol: 'BRIGADE.NS', name: 'BRIGADE' },
  { symbol: 'CGCL.NS', name: 'CGCL' },
  { symbol: 'PSB.NS', name: 'PSB' },
  { symbol: 'REDINGTON.NS', name: 'REDINGTON' },
  { symbol: 'TRAVELFOOD.NS', name: 'TRAVELFOOD' },
  { symbol: 'NAVA.NS', name: 'NAVA' },
  { symbol: 'ACMESOLAR.NS', name: 'ACMESOLAR' },
  { symbol: 'TATACHEM.NS', name: 'TATACHEM' },
  { symbol: 'CHALET.NS', name: 'CHALET' },
  { symbol: 'GRINDWELL.NS', name: 'GRINDWELL' },
  { symbol: 'SUNDRMFAST.NS', name: 'SUNDRMFAST' },
  { symbol: 'CENTURYPLY.NS', name: 'CENTURYPLY' },
  { symbol: 'SYRMA.NS', name: 'SYRMA' },
  { symbol: 'CARBORUNIV.NS', name: 'CARBORUNIV' },
  { symbol: 'RATNAMANI.NS', name: 'RATNAMANI' },
  { symbol: 'INDIGRID.NS', name: 'INDIGRID' },
  { symbol: 'GALLANTT.NS', name: 'GALLANTT' },
  { symbol: 'BIKAJI.NS', name: 'BIKAJI' },
  { symbol: 'OLAELEC.NS', name: 'OLAELEC' },
  { symbol: 'VTL.NS', name: 'VTL' },
  { symbol: 'ELGIEQUIP.NS', name: 'ELGIEQUIP' },
  { symbol: 'ONESOURCE.NS', name: 'ONESOURCE' },
  { symbol: 'GRANULES.NS', name: 'GRANULES' },
  { symbol: 'RRKABEL.NS', name: 'RRKABEL' },
  { symbol: 'SYNGENE.NS', name: 'SYNGENE' },
  { symbol: 'ZYDUSWELL.NS', name: 'ZYDUSWELL' },
  { symbol: 'EMMVEE.NS', name: 'EMMVEE' },
  { symbol: 'KFINTECH.NS', name: 'KFINTECH' },
  { symbol: 'KEC.NS', name: 'KEC' },
  { symbol: 'BASF.NS', name: 'BASF' },
  { symbol: 'CROMPTON.NS', name: 'CROMPTON' },
  { symbol: 'AARTIIND.NS', name: 'AARTIIND' },
  { symbol: 'CHOICEIN.NS', name: 'CHOICEIN' },
  { symbol: 'BHARATCOAL.NS', name: 'BHARATCOAL' },
  { symbol: 'FSL.NS', name: 'FSL' },
  { symbol: 'IFCI.NS', name: 'IFCI' },
  { symbol: 'AETHER.NS', name: 'AETHER' },
  { symbol: 'MAHSCOOTER.NS', name: 'MAHSCOOTER' },
  { symbol: 'KANSAINER.NS', name: 'KANSAINER' },
  { symbol: 'KSB.NS', name: 'KSB' },
  { symbol: 'INOXWIND.NS', name: 'INOXWIND' },
  { symbol: 'EIDPARRY.NS', name: 'EIDPARRY' },
  { symbol: 'CHENNPETRO.NS', name: 'CHENNPETRO' },
  { symbol: 'JAINREC.NS', name: 'JAINREC' },
  { symbol: 'IGIL.NS', name: 'IGIL' },
  { symbol: 'POLYMED.NS', name: 'POLYMED' },
  { symbol: 'DOMS.NS', name: 'DOMS' },
  { symbol: 'ANURAS.NS', name: 'ANURAS' },
  { symbol: 'TRITURBINE.NS', name: 'TRITURBINE' },
  { symbol: 'ABREL.NS', name: 'ABREL' },
  { symbol: 'JSWHL.NS', name: 'JSWHL' },
  { symbol: 'CCL.NS', name: 'CCL' },
  { symbol: 'CEATLTD.NS', name: 'CEATLTD' },
  { symbol: 'JBMA.NS', name: 'JBMA' },
  { symbol: 'VGUARD.NS', name: 'VGUARD' },
  { symbol: 'LMW.NS', name: 'LMW' },
  { symbol: 'SHRIPISTON.NS', name: 'SHRIPISTON' },
  { symbol: 'THELEELA.NS', name: 'THELEELA' },
  { symbol: 'APLLTD.NS', name: 'APLLTD' },
  { symbol: 'FRACTAL.NS', name: 'FRACTAL' },
  { symbol: 'RUBICON.NS', name: 'RUBICON' },
  { symbol: 'LTFOODS.NS', name: 'LTFOODS' },
  { symbol: 'FINEORG.NS', name: 'FINEORG' },
  { symbol: 'SANSERA.NS', name: 'SANSERA' },
  { symbol: 'VENTIVE.NS', name: 'VENTIVE' },
  { symbol: 'JUBLPHARMA.NS', name: 'JUBLPHARMA' },
  { symbol: 'SOBHA.NS', name: 'SOBHA' },
  { symbol: 'SPLPETRO.NS', name: 'SPLPETRO' },
  { symbol: 'CANHLIFE.NS', name: 'CANHLIFE' },
  { symbol: 'ECLERX.NS', name: 'ECLERX' },
  { symbol: 'ZENTEC.NS', name: 'ZENTEC' },
  { symbol: 'AGARWALEYE.NS', name: 'AGARWALEYE' },
  { symbol: 'PGEL.NS', name: 'PGEL' },
  { symbol: 'TDPOWERSYS.NS', name: 'TDPOWERSYS' },
  { symbol: 'AKZOINDIA.NS', name: 'AKZOINDIA' },
  { symbol: 'NIVABUPA.NS', name: 'NIVABUPA' },
  { symbol: 'GSPL.NS', name: 'GSPL' },
  { symbol: 'ARE_M.NS', name: 'ARE_M' },
  { symbol: 'J_KBANK.NS', name: 'J_KBANK' },
  { symbol: 'DEEPAKFERT.NS', name: 'DEEPAKFERT' },
  { symbol: 'BEML.NS', name: 'BEML' },
  { symbol: 'VINATIORGA.NS', name: 'VINATIORGA' },
  { symbol: 'USHAMART.NS', name: 'USHAMART' },
  { symbol: 'GABRIEL.NS', name: 'GABRIEL' },
  { symbol: 'ABDL.NS', name: 'ABDL' },
  { symbol: 'DEVYANI.NS', name: 'DEVYANI' },
  { symbol: 'FINCABLES.NS', name: 'FINCABLES' },
  { symbol: 'JINDALSAW.NS', name: 'JINDALSAW' },
  { symbol: 'TEGA.NS', name: 'TEGA' },
  { symbol: 'ALIVUS.NS', name: 'ALIVUS' },
  { symbol: 'MTARTECH.NS', name: 'MTARTECH' },
  { symbol: 'RAINBOW.NS', name: 'RAINBOW' },
  { symbol: 'THANGAMAYL.NS', name: 'THANGAMAYL' },
  { symbol: 'FIRSTCRY.NS', name: 'FIRSTCRY' },
  { symbol: 'CAPLIPOINT.NS', name: 'CAPLIPOINT' },
  { symbol: 'INDIAMART.NS', name: 'INDIAMART' },
  { symbol: 'ZENSARTECH.NS', name: 'ZENSARTECH' },
  { symbol: 'IRCON.NS', name: 'IRCON' },
  { symbol: 'TRIDENT.NS', name: 'TRIDENT' },
  { symbol: 'SAMMAANCAP.NS', name: 'SAMMAANCAP' },
  { symbol: 'FIVESTAR.NS', name: 'FIVESTAR' },
  { symbol: 'TECHNOE.NS', name: 'TECHNOE' },
  { symbol: 'GRAPHITE.NS', name: 'GRAPHITE' },
  { symbol: 'JMFINANCIL.NS', name: 'JMFINANCIL' },
  { symbol: 'CUPID.NS', name: 'CUPID' },
  { symbol: 'PARADEEP.NS', name: 'PARADEEP' },
  { symbol: 'TBOTEK.NS', name: 'TBOTEK' },
  { symbol: 'HFCL.NS', name: 'HFCL' },
  { symbol: 'ABLBL.NS', name: 'ABLBL' },
  { symbol: 'KIRLOSBROS.NS', name: 'KIRLOSBROS' },
  { symbol: 'JKTYRE.NS', name: 'JKTYRE' },
  { symbol: 'COHANCE.NS', name: 'COHANCE' },
  { symbol: 'MINDACORP.NS', name: 'MINDACORP' },
  { symbol: 'UTIAMC.NS', name: 'UTIAMC' },
  { symbol: 'INGERRAND.NS', name: 'INGERRAND' },
  { symbol: 'HAPPYFORGE.NS', name: 'HAPPYFORGE' },
  { symbol: 'BLUEDART.NS', name: 'BLUEDART' },
  { symbol: 'NSLNISP.NS', name: 'NSLNISP' },
  { symbol: 'SIGNATURE.NS', name: 'SIGNATURE' },
  { symbol: 'BLS.NS', name: 'BLS' },
  { symbol: 'INDGN.NS', name: 'INDGN' },
  { symbol: 'LUMAXTECH.NS', name: 'LUMAXTECH' },
  { symbol: 'WELSPUNLIV.NS', name: 'WELSPUNLIV' },
  { symbol: 'ENGINERSIN.NS', name: 'ENGINERSIN' },
  { symbol: 'INDIACEM.NS', name: 'INDIACEM' },
  { symbol: 'CMPDI.NS', name: 'CMPDI' },
  { symbol: 'IEX.NS', name: 'IEX' },
  { symbol: 'JPPOWER.NS', name: 'JPPOWER' },
  { symbol: 'JWL.NS', name: 'JWL' },
  { symbol: 'UJJIVANSFB.NS', name: 'UJJIVANSFB' }
];

const formatVal = (val, options = { minimumFractionDigits: 2 }) => {
  if (val === null || val === undefined || isNaN(Number(val))) return '—';
  return Number(val).toLocaleString(undefined, options);
};

export default function App() {
  const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  const [marketData, setMarketData] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [ticker, setTicker] = useState('');
  const [inputTicker, setInputTicker] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // AI State
  const [aiReport, setAiReport] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  
  // Terminal State
  const [showHelp, setShowHelp] = useState(false);

  // Fetch Market Pulse
  useEffect(() => {
    fetch(`${API_BASE}/api/market`)
      .then(res => res.json())
      .then(data => setMarketData(data))
      .catch(err => console.error("Market fetch error"));
  }, []);

  // Fetch Stock Data
  useEffect(() => {
    if (!ticker.trim()) {
      setStockData(null);
      return;
    }
    setLoading(true);
    fetch(`${API_BASE}/api/stock/${ticker}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.signals) setStockData(data);
        else setStockData(null);
      })
      .catch(err => setStockData(null))
      .finally(() => setLoading(false));
  }, [ticker]);

  const generateAI = async () => {
    setAiLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/ai-report/${ticker}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: apiKey }),
      });
      const data = await res.json();
      setAiReport(data.report);
    } catch (e) {
      setAiReport("⚠️ Error generating report. Check connection and API Key.");
    }
    setAiLoading(false);
  };

  const filteredSuggestions = POPULAR_TICKERS.filter(
    (t) => t.symbol.includes(inputTicker) || t.name.toUpperCase().includes(inputTicker)
  );

  return (
    <div className="min-h-screen w-full bg-outline flex flex-col font-sans text-gray-200 relative overflow-x-hidden">
      
      {/* 1. COMPACT TOP HEADER */}
      <header className="h-[48px] bg-background flex items-center justify-between px-4 border-b border-outline shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-white">
            <Zap className="text-primary w-4 h-4" />
            <h1 className="text-sm font-bold tracking-widest">
              QUANT<span className="text-primary">EDGE</span>
            </h1>
          </div>
          <div className="h-4 w-[1px] bg-outline"></div>
          <div className="flex items-center gap-2 relative">
            <span className="text-xs font-mono text-gray-500">TICKER:</span>
            <input 
              type="text" 
              value={inputTicker}
              onChange={(e) => {
                 setInputTicker(e.target.value.toUpperCase());
                 setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyDown={(e) => {
                 if (e.key === 'Enter') {
                    setTicker(inputTicker);
                    setShowSuggestions(false);
                 }
              }}
              className="bg-surface border border-outline rounded-none px-3 py-1 w-56 text-white font-mono text-xs focus:outline-none focus:border-primary transition-all uppercase"
              placeholder="e.g. RELIANCE.NS, TATA"
            />
            {/* Google-Style Live OmniBox Suggestions */}
            {showSuggestions && inputTicker && filteredSuggestions.length > 0 && (
              <ul className="absolute top-full right-0 mt-[1px] w-56 bg-surface border border-outline z-[100] shadow-2xl max-h-48 overflow-y-auto custom-scrollbar">
                {filteredSuggestions.map((item) => (
                  <li 
                    key={item.symbol}
                    onClick={() => {
                        setInputTicker(item.symbol);
                        setTicker(item.symbol);
                        setShowSuggestions(false);
                    }}
                    className="px-3 py-2 text-xs font-mono hover:bg-primary/20 text-white cursor-pointer border-b border-outline/50 flex flex-col gap-1 last:border-0 transition-colors"
                  >
                    <span className="font-bold text-accent">{item.symbol}</span>
                    <span className="text-[9px] text-gray-400 font-sans tracking-wide">{item.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-[10px] font-mono text-accent uppercase tracking-widest pr-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
            Node Connected [127.0.0.1:8000]
          </span>
        </div>
      </header>

      {/* 2. MAIN TERMINAL GRID */}
      <main className="w-full h-[calc(100vh-48px)] grid grid-cols-12 grid-rows-1 gap-[1px] bg-outline z-0 shrink-0">
        
        {/* PANEL A: MACRO & SIGNALS (Left Sidebar) */}
        <section className="col-span-3 bg-background flex flex-col overflow-y-auto custom-scrollbar">
          
          <div className="p-3 border-b border-outline bg-surface sticky top-0 z-10 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-gray-400" />
            <h2 className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">Market Pulse</h2>
          </div>

          <div className="p-4 space-y-6">
            {marketData ? (
              <div className="space-y-4">
                <div className="bg-surface p-3 border border-outline">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-gray-500 font-mono">NIFTY 50</span>
                    <span className={`text-xs font-bold ${marketData.nifty_change > 0 ? 'text-accent' : 'text-danger'}`}>
                      {marketData.nifty_pct > 0 ? '+' : ''}{marketData.nifty_pct.toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-2xl font-light text-white font-mono tracking-tight">
                    {formatVal(marketData.nifty_price)}
                  </div>
                  <div className="h-10 mt-2 -mx-1 opacity-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={marketData.chart}>
                        <Line type="step" dataKey="value" stroke={marketData.nifty_change > 0 ? '#6bfe9c' : '#ee7d77'} strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-surface p-3 border border-outline flex justify-between items-center">
                  <div>
                    <span className="text-xs text-gray-500 font-mono block mb-1">INDIA VIX</span>
                    <span className="text-xl font-light text-white font-mono tracking-tight">{marketData.vix.toFixed(2)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500 font-mono block mb-1">MACRO TREND</span>
                    <span className={`text-sm font-bold tracking-widest ${marketData.mood === 'GREEN' ? 'text-accent' : marketData.mood === 'RED' ? 'text-danger' : 'text-yellow-500'}`}>
                      {marketData.trend}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
               <div className="text-xs text-gray-500 font-mono flex items-center"><RefreshCw className="w-3 h-3 animate-spin mr-2"/> Syncing Market...</div>
            )}

            {/* Confluence Signals */}
            {stockData && (
               <div className="pt-2 border-t border-outline/50">
                 <h3 className="text-xs font-mono text-gray-500 mb-3">CONFLUENCE VERDICT: {ticker}</h3>
                 
                 <div className={`p-4 border ${stockData.signals.overall === 'BUY' ? 'border-accent bg-accent/5' : stockData.signals.overall === 'SELL' ? 'border-danger bg-danger/5' : 'border-gray-500 bg-gray-500/5'} mb-4`}>
                    <div className="flex justify-between items-end">
                      <span className={`text-4xl font-black tracking-tighter leading-none ${stockData.signals.overall === 'BUY' ? 'text-accent' : stockData.signals.overall === 'SELL' ? 'text-danger' : 'text-gray-400'}`}>
                        {stockData.signals.overall}
                      </span>
                      <span className="text-xs font-mono text-gray-400">
                        CONFIDENCE: {Math.round(stockData.signals.strength * 100)}%
                      </span>
                    </div>
                 </div>

                 <div className="flex flex-col gap-[2px]">
                   {Object.entries(stockData.signals.indicators).map(([key, value]) => (
                     <div key={key} className="flex justify-between items-center bg-surface p-2 border border-outline">
                       <span className="text-xs text-gray-400 font-mono">{key}</span>
                       <span className={value === 'BUY' ? 'text-accent text-xs font-bold' : value === 'SELL' ? 'text-danger text-xs font-bold' : 'text-gray-400 text-xs'}>
                         {value}
                       </span>
                     </div>
                   ))}
                 </div>
               </div>
            )}
          </div>
        </section>

        {/* PANEL B: PRIMARY WORKSPACE (Center Chart) */}
        <section className="col-span-6 bg-background flex flex-col relative min-h-0">
          <div className="p-3 border-b border-outline bg-surface sticky top-0 z-10 flex flex-col gap-2">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-gray-400" />
                <h2 className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">Interactive Chart Engine</h2>
              </div>
              {stockData?.live && (
                <span className="text-lg font-light text-white font-mono tracking-tighter">
                  {formatVal(stockData.live.price)}
                </span>
              )}
            </div>
            
            {/* NEW TELEMETRY STRIP */}
            {stockData?.live && (
              <div className="flex items-center gap-4 text-[10px] font-mono text-gray-400 bg-background/50 border border-outline px-3 py-1 mt-1">
                 <span className="flex items-center gap-1">Vol: <span className="text-gray-200">{stockData.live.volume ? `${(stockData.live.volume / 1000000).toFixed(2)}M` : '—'}</span></span>
                 <span className="text-outline">|</span>
                 <span className="flex items-center gap-1">Open: <span className="text-gray-200">{formatVal(stockData.live.open)}</span></span>
                 <span className="text-outline">|</span>
                 <span className="flex items-center gap-1">High: <span className="text-accent">{formatVal(stockData.live.high)}</span></span>
                 <span className="text-outline">|</span>
                 <span className="flex items-center gap-1">Low: <span className="text-danger">{formatVal(stockData.live.low)}</span></span>
              </div>
            )}
          </div>
          
          <div className="flex-1 p-4 w-full h-full">
            {loading ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-primary">
                <RefreshCw className="w-6 h-6 animate-spin mb-3" />
                <span className="text-xs font-mono uppercase tracking-widest">Compiling Nodes...</span>
              </div>
            ) : stockData?.chart ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stockData.chart}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={stockData.chart[stockData.chart.length-1]?.Close > stockData.chart[0]?.Close ? '#6bfe9c' : '#ee7d77'} stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#0a0e14" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid strokeDasharray="1 4" stroke="#1a2637" vertical={true} />
                  
                  <XAxis 
                    dataKey="date" 
                    stroke="#3c495b" 
                    tick={{fill: '#6a768a', fontSize: 10, fontFamily: 'monospace'}} 
                    tickMargin={10} 
                    minTickGap={40} 
                  />
                  <YAxis 
                    domain={['auto', 'auto']} 
                    stroke="#3c495b" 
                    tick={{fill: '#6a768a', fontSize: 10, fontFamily: 'monospace'}} 
                    orientation="right" 
                    tickFormatter={(val) => val.toLocaleString()} 
                  />
                  <Tooltip 
                    cursor={{ stroke: '#3c495b', strokeWidth: 1, strokeDasharray: '3 3' }}
                    contentStyle={{ backgroundColor: '#0e141c', border: '1px solid #3c495b', borderRadius: '0', color: '#fff', fontSize: '12px', fontFamily: 'monospace' }}
                    itemStyle={{ color: '#bac7dd' }}
                  />
                  
                  <Area 
                    type="step" 
                    dataKey="Close" 
                    stroke={stockData.chart[stockData.chart.length-1]?.Close > stockData.chart[0]?.Close ? '#6bfe9c' : '#ee7d77'} 
                    strokeWidth={1.5} 
                    fill="url(#chartGradient)" 
                    isAnimationActive={false}
                  />
                  
                  {stockData.chart[0]?.SMA_20 && (
                    <Line 
                      type="monotone" 
                      dataKey="SMA_20" 
                      stroke="#bac7dd" 
                      strokeOpacity={0.5} 
                      strokeWidth={1} 
                      dot={false} 
                      isAnimationActive={false} 
                      name="SMA-20" 
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-danger font-mono text-sm">
                 DATA STREAM FAILED OR EMPTY.
              </div>
            )}
          </div>
        </section>

        {/* PANEL C: INTELLIGENCE & NEWS (Right Sidebar) */}
        <section className="col-span-3 bg-background flex flex-col min-h-0">
          
          <div className="p-3 border-b border-outline bg-surface sticky top-0 z-10 flex items-center gap-2">
            <Brain className="w-3.5 h-3.5 text-gray-400" />
            <h2 className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">AI Intelligence</h2>
          </div>

          <div className="flex flex-col h-full overflow-hidden">
            
            {/* Gemini Setup Form (Top Half) */}
            <div className="p-4 border-b border-outline flex-1 overflow-y-auto custom-scrollbar shrink-0 max-h-[50%]">
              <div className="bg-surface border border-outline p-3 space-y-2 mb-4 shrink-0">
                 <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono mb-1">
                   <Lock className="w-3 h-3" />
                   <span>SECURE LLM CONNECTION</span>
                 </div>
                 <input 
                   type="password" 
                   value={apiKey}
                   onChange={(e) => setApiKey(e.target.value)}
                   placeholder="Enter Gemini API Key..." 
                   className="w-full bg-background border border-outline px-2 py-1.5 text-[10px] text-white font-mono focus:outline-none focus:border-primary transition-all rounded-none"
                 />
                 <button 
                   onClick={generateAI}
                   disabled={aiLoading || !apiKey}
                   className="w-full bg-outline hover:bg-primary/20 text-white font-mono text-[10px] tracking-widest uppercase py-1.5 transition-all border border-transparent hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {aiLoading ? 'Synthesizing...' : 'Run Analysis'}
                 </button>
              </div>

              {/* AI Report Markdown Container */}
              <div className="w-full">
                 {aiLoading ? (
                   <div className="h-24 flex flex-col items-center justify-center text-primary/50 space-y-3">
                     <div className="w-full h-1 bg-surface overflow-hidden relative">
                       <div className="absolute top-0 left-0 h-full bg-primary/50 w-1/3 animate-ping"></div>
                     </div>
                     <span className="text-[10px] font-mono tracking-widest">INGESTING DATASET...</span>
                   </div>
                 ) : aiReport ? (
                   <div className="prose prose-invert prose-sm max-w-none text-gray-300 font-sans leading-relaxed text-[11px]"
                        dangerouslySetInnerHTML={{__html: aiReport.replace(/\n\n/g, '<br/><br/>')}} />
                 ) : (
                   <div className="h-24 flex flex-col items-center justify-center text-gray-600 font-mono text-[10px] px-6 text-center border border-dashed border-outline/50 p-4">
                     No intelligence report generated. Insert API key.
                   </div>
                 )}
              </div>
            </div>

            {/* LIVE NEWS MATRIX (Bottom Half) */}
            <div className="flex-1 flex flex-col min-h-[50%] bg-surface/30">
               <div className="p-2 border-b border-outline bg-surface sticky top-0 flex items-center gap-2">
                 <Globe className="w-3 h-3 text-gray-400" />
                 <h3 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Live News Matrix</h3>
               </div>
               <div className="p-3 overflow-y-auto custom-scrollbar space-y-2">
                 {loading ? (
                   <div className="text-[10px] font-mono text-gray-500 text-center mt-4">Scanning news endpoints...</div>
                 ) : stockData?.news && stockData.news.length > 0 ? (
                   stockData.news.map((item, idx) => (
                     <a key={idx} href={item.Link} target="_blank" rel="noreferrer" className="block p-3 border border-outline bg-background hover:bg-surfaceLight hover:border-primary transition-all group">
                       <div className="flex justify-between items-start mb-2">
                         <span className="text-[9px] font-mono text-primary truncate max-w-[60%]">{item.Source}</span>
                         <span className={`text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider ${item.Sentiment.includes('Pos') ? 'text-accent bg-accent/10 border border-accent/20' : item.Sentiment.includes('Neg') ? 'text-danger bg-danger/10 border border-danger/20' : 'text-gray-400 bg-gray-500/10 border border-gray-500/20'}`}>
                           {item.Sentiment.replace(/[^A-Za-z]/g, '')} {/* Remove emojis for brutalist look */}
                         </span>
                       </div>
                       <p className="text-[11px] text-gray-300 group-hover:text-white leading-snug line-clamp-2">{item.Title}</p>
                     </a>
                   ))
                 ) : (
                   <div className="text-[10px] font-mono text-gray-500 text-center mt-4 border border-dashed border-outline/50 p-4">No recent market news found.</div>
                 )}
               </div>
            </div>

          </div>
        </section>
      </main>

      {/* 3. STATIC HOW TO GUIDE (Scroll Down) */}
      <footer className="w-full bg-surface border-t-2 border-outline pb-12 pt-8 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-white tracking-widest uppercase mb-8 flex items-center">
            <TerminalSquare className="mr-3 text-primary w-6 h-6"/> System Terminal Databank
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background border border-outline p-6">
              <h3 className="text-primary font-mono text-sm mb-4 border-b border-outline pb-2 flex items-center">
                <span className="w-4 h-4 bg-primary text-background flex items-center justify-center font-bold text-[10px] mr-2">1</span> 
                Ticking Input
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                The terminal links directly to global data pipelines. For <span className="text-white">US Stocks</span>, standard abbreviations (e.g. <code>AAPL</code>, <code>MSFT</code>) work. For <span className="text-white">Indian Equities</span>, you must append <code>.NS</code> (e.g. <code>RELIANCE.NS</code>, <code>TCS.NS</code>) for NSE listings.
              </p>
            </div>
            
            <div className="bg-background border border-outline p-6">
              <h3 className="text-primary font-mono text-sm mb-4 border-b border-outline pb-2 flex items-center">
                <span className="w-4 h-4 bg-primary text-background flex items-center justify-center font-bold text-[10px] mr-2">2</span> 
                Confluence Paradigm
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                The platform computes an institutional-grade <span className="text-accent font-bold">BUY</span> / <span className="text-danger font-bold">SELL</span> verdict. This is derived from a "Confluence" (agreement) of 5 complex metrics natively crunching high-frequency data in our FastAPI backend (SMA, EMA, RSI, MACD, Bollinger Bands). 
              </p>
            </div>

            <div className="bg-background border border-outline p-6">
              <h3 className="text-primary font-mono text-sm mb-4 border-b border-outline pb-2 flex items-center">
                <span className="w-4 h-4 bg-primary text-background flex items-center justify-center font-bold text-[10px] mr-2">3</span> 
                AI Synthesis (Gemini)
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Paste your secure Google Gemini API key to trigger the AI intelligence engine. The LLM will parse the numeric algorithmic data <i>and</i> the Live News Matrix simultaneously to deliver an executive human-readable recommendation.
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center border-t border-outline pt-6">
            <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">
              Disclaimer: The Quantitative Terminal outputs algorithmic predictions. Execute trades explicitly at your own risk.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

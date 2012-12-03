<?php
	header("content-type: text/xml; charset=UTF-8");
	header("Access-Control-Allow-Origin: *");

	echo "<";
	echo "?xml version=\"1.0\" encoding=\"UTF-8\" ?";
	echo ">\n";

	echo "<reversegeocode";
	echo " timestamp='".date(DATE_RFC822)."'";
	echo " attribution='Data © OpenStreetMap contributors, ODbL 1.0. http://www.openstreetmap.org/copyright'";
	echo " querystring='".htmlspecialchars($_SERVER['QUERY_STRING'], ENT_QUOTES)."'";
	echo ">\n";

	if (!sizeof($aPlace))
	{
		if ($sError)
			echo "<error>$sError</error>";
		else
			echo "<error>Unable to geocode</error>";
	}
	else
	{
		echo "<result";
		if ($aPlace['place_id']) echo ' place_id="'.$aPlace['place_id'].'"';
		if ($aPlace['osm_type'] && $aPlace['osm_id']) echo ' osm_type="'.($aPlace['osm_type']=='N'?'node':($aPlace['osm_type']=='W'?'way':'relation')).'"'.' osm_id="'.$aPlace['osm_id'].'"';
		if ($aPlace['ref']) echo ' ref="'.htmlspecialchars($aPlace['ref']).'"';
		if (isset($aPlace['lat'])) echo ' lat="'.htmlspecialchars($aPlace['lat']).'"';
		if (isset($aPlace['lon'])) echo ' lon="'.htmlspecialchars($aPlace['lon']).'"';
		echo ">".htmlspecialchars($aPlace['langaddress'])."</result>";

        if ($bShowAddressDetails) {
			echo "<addressparts>";
			foreach($aAddress as $sKey => $sValue)
			{
				$sKey = str_replace(' ','_',$sKey);
				echo "<$sKey>";
				echo htmlspecialchars($sValue);
				echo "</$sKey>";
			}
			echo "</addressparts>";
        }
	}
	
	echo "</reversegeocode>";

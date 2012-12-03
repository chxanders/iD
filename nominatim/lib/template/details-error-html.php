<?php
	header("content-type: text/html; charset=UTF-8");
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>OpenStreetMap Nominatim: <?php echo $aPointDetails['localname'];?></title>
    <style>
body {
	margin:0px;
	padding:16px;
  background:#ffffff;
  height: 100%;
  font: normal 12px/15px arial,sans-serif;
}
.line{
  margin-left:20px;
}
.name{
  font-weight: bold;
}
.notused{
  color:#ddd;
}
.noname{
  color:#800;
}
#map {
  width:500px;
  height:500px;
  border: 2px solid #666;
  float: right;
}
    </style>
	<script src="js/OpenLayers.js"></script>
	<script src="js/tiles.js"></script>
	<script type="text/javascript">
        
		var map;

    function init() {
			map = new OpenLayers.Map ("map", {
                controls:[
										new OpenLayers.Control.Permalink(),
										new OpenLayers.Control.Navigation(),
										new OpenLayers.Control.PanZoomBar(),
										new OpenLayers.Control.MouseDefaults(),
										new OpenLayers.Control.MousePosition(),
										new OpenLayers.Control.Attribution()],
                maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
                maxResolution: 156543.0399,
                numZoomLevels: 19,
                units: 'm',
                projection: new OpenLayers.Projection("EPSG:900913"),
                displayProjection: new OpenLayers.Projection("EPSG:4326")
            	} );
			map.addLayer(new OpenLayers.Layer.OSM.<?php echo CONST_Tile_Default;?>("Default"));

                        var layer_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
                        layer_style.fillOpacity = 0.2;
                        layer_style.graphicOpacity = 0.2;

			vectorLayer = new OpenLayers.Layer.Vector("Points", {style: layer_style});
			map.addLayer(vectorLayer);

            var proj_EPSG4326 = new OpenLayers.Projection("EPSG:4326");
			var proj_map = map.getProjectionObject();

            freader = new OpenLayers.Format.WKT({
                'internalProjection': proj_map,
                'externalProjection': proj_EPSG4326
            });

            var bounds;
            <?php if ($aPointDetails['prevgeom']) { ?>
            var feature = freader.read('<?php echo $aPointDetails['prevgeom'];?>');
            if (feature) {
                bounds = feature.geometry.getBounds();

            }
            feature.style = {
				strokeColor: "#777777",
				fillColor: "#F0F0F0",
				strokeWidth: 2,
				strokeOpacity: 0.75,
				fillOpacity: 0.75,
                strokeDashstyle: "longdash"
			};
            vectorLayer.addFeatures([feature]);
            <?php } ?>

            <?php if ($aPointDetails['newgeom']) { ?>
            feature = freader.read('<?php echo $aPointDetails['newgeom'];?>');
            if (feature) {
                if (!bounds) {
                    bounds = feature.geometry.getBounds();
                } 
                else 
                {
                    bounds.extend(feature.geometry.getBounds());
                }
            }
            feature.style = {
				strokeColor: "#75ADFF",
				fillColor: "#FFF7F0",
				strokeWidth: 2,
				strokeOpacity: 0.75,
				fillOpacity: 0.75
			};
            vectorLayer.addFeatures([feature]);
            <?php } ?>

            <?php if (isset($aPointDetails['error_x'])) { ?>
            var pt = new OpenLayers.Geometry.Point(<?php echo $aPointDetails['error_x'].','.$aPointDetails['error_y'];?>);
            pt = pt.transform(proj_EPSG4326, proj_map);
            feature = new OpenLayers.Feature.Vector(pt, null,
                       {
                            graphicName : "x",
                            fillColor: "#FF0000",
                            graphic : true,
                            pointRadius: 6
                       });
            vectorLayer.addFeatures([feature]);
            <?php } ?>


            map.zoomToExtent(bounds);

		}
		
	</script>
  </head>
  <body onload="init();">
    <div id="map"></div>
	<h1><?php echo $aPointDetails['localname'] ?></h1>
	<div class="locationdetails">
	<div>Type: <span class="type"><?php echo $aPointDetails['class'].':'.$aPointDetails['type'];?></span></div>
 
<?php
    $sOSMType = ($aPointDetails['osm_type'] == 'N'?'node':($aPointDetails['osm_type'] == 'W'?'way':   ($aPointDetails['osm_type'] == 'R'?'relation':'')));
    if ($sOSMType) echo ' <div>OSM: <span class="osm"><span class="label"></span>'.$sOSMType.' <a     href="http://www.openstreetmap.org/browse/'.$sOSMType.'/'.$aPointDetails['osm_id'].'">'.              $aPointDetails['osm_id'].'</a></span></div>';
?>

    <p>This object has an invalid geometry.</p>
    <p><b>Details:</b> <?php

$sVal = $aPointDetails['errormessage']?$aPointDetails['errormessage']:'&nbsp;';
$sOSMType = ($aPointDetails['osm_type'] == 'N'?'node':($aPointDetails['osm_type'] == 'W'?'way':($aPointDetails['osm_type'] == 'R'?'relation':'')));
$sOSMID = $aPointDetails['osm_id'];

if (isset($aPointDetails['error_x']))
{
	$sLat = $aPointDetails['error_y'];
	$sLon = $aPointDetails['error_x'];
	echo "<a href=\"http://www.openstreetmap.org/?lat=".$sLat."&lon=".$sLon."&zoom=18&layers=M&".$sOSMType."=".$sOSMID."\">".$sVal."</a>";
}
else
{
	echo $sVal;
}
?>
    <p><b>Edit:</b> in <?php
if (isset($aPointDetails['error_x']))
{
	$fWidth = 0.0002;
	echo " <a href=\"http://localhost:8111/load_and_zoom?left=".($sLon-$fWidth)."&right=".($sLon+$fWidth)."&top=".($sLat+$fWidth)."&bottom=".($sLat-$fWidth)."\" target=\"josm\">Remote Control (JOSM / Merkaartor)</a>";
	echo " | <a href=\"http://www.openstreetmap.org/edit?editor=potlatch2&bbox=".($sLon-$fWidth).",".($sLat-$fWidth).",".($sLon+$fWidth).",".($sLat+$fWidth)."\" target=\"potlatch2\">Potlatch 2</a>";
}
else
{
	echo " <a href=\"http://localhost:8111/import?url=http://www.openstreetmap.org/api/0.6/".$sOSMType.'/'.$sOSMID."/full\" target=\"josm\">Remote Control (JOSM / Merkaartor)</a>";
	// Should be better to load by object id - but this doesn't seem to zoom correctly
	//echo " <a href=\"http://localhost:8111/load_object?new_layer=true&objects=".strtolower($aPointDetails['osm_type']).$sOSMID."\" target=\"josm\">Remote Control (JOSM / Merkaartor)</a>";
}

?></p>

  </body>
</html>


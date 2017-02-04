var assert = require( 'assert' );

import extract from './../../../../libs/server/endpoints/voyager/extract-destinations'

describe('extract-destinations', function() {
  it('Borobudur', function() {
    var section = {
      text: '<div>\n\n<ul><li id="mwAUE"> The Hindu temples of <a href="/wiki/Prambanan" title="Prambanan">Prambanan</a>, about an hour away by car, make the perfect complement to Borobudur.</li></ul>\n\n<ul><li id="mwAUQ"> The cultural splendour of <a href="/wiki/Yogyakarta" title="Yogyakarta">Yogyakarta</a> is about 90 minutes by bus.</li></ul>\n\n<ul><li id="mwAUc"> The <a href="/wiki/Dieng_Plateau" title="Dieng Plateau">Dieng Plateau</a> is a volcanic area in the highlands of Central Java with the oldest standing temples in Indonesia, pre-dating Borobudur by some 100 years. About a 90 minute drive to the northwest.</li></ul>\n\n<ul><li id="mwAUo"> If you want to see a <i>serious</i>  active volcano, <a href="/wiki/Mount_Merapi" title="Mount Merapi">Mount Merapi</a> is about a 2 hour drive to the east.</li></ul>\n\n<p>However if you are based in Yogyakarta or other locations and not driving yourself , there are \'tours\' or \'climbing\' ventures, that in most cases leave from Yogyakarta, and drive to Selo (located in the valley between Merbabu and Merapi) which is a traditional location to walk to the top of Merapi in the middle of the night for the dawn views.</p>\n\n\n\n<span>\n</span>\n\n\n\n\n\n</div>'
    };

    section = extract( section );
    assert.strictEqual( section.destinations.length, 4 );
    assert.strictEqual( section.destinations[0].title, 'Prambanan' );
    assert.strictEqual( section.destinations[1].title, 'Yogyakarta' );
    assert.strictEqual( section.destinations[2].title, 'Dieng Plateau' );
    assert.strictEqual( section.destinations[3].title, 'Mount Merapi' );
    assert.ok( section.text.indexOf( 'is about 90 minutes by bus.' ) > -1 );
  });

  it('Asia', function() {
    var section = {
      text: '<p>See also <a href="/wiki/UNESCO_World_Heritage_List#Asia" title="UNESCO World Heritage List">UNESCO World Heritage List#Asia</a>.</p>'
    };

    section = extract( section );
    assert.strictEqual( section.seeAlso.length, 1 );
    assert.strictEqual( section.seeAlso[0].title, 'UNESCO World Heritage List#Asia' );
    assert.strictEqual( section.seeAlso[0].url, '/wiki/UNESCO_World_Heritage_List#Asia' );
    assert.ok( section.text.indexOf( 'See also' ) === -1 );
  });

  it('Cairo', function() {
    var section = {
      text: '<ul><li id="mwKQ"><a href="/wiki/Sharm_el_Sheikh" title="Sharm el Sheikh">Sharm el Sheikh</a> <span>–</span> a hugely popular resort town on the Sinai peninsula, with some of the best scuba diving in the world.</li></ul>'
    };

    section = extract( section );
    assert.strictEqual( section.destinations[0].description,
      'a hugely popular resort town on the Sinai peninsula, with some of the best scuba diving in the world.' );
    assert.ok( section.text.indexOf( 'a hugely popular resort' ) === -1 );
  });

  it('Africa', function() {
    var section = {
      text: '<dl about="#mwt5"><dd> <i>See also: <a href="/wiki/African_National_Parks" title="African National Parks">African National Parks</a></i></dd></dl>'
    };

    section = extract( section );
    assert.strictEqual( section.seeAlso.length, 1 );
    assert.strictEqual( section.seeAlso[0].title, 'African National Parks' );
    assert.ok( section.text.indexOf( 'African National Parks' ) === -1 );
  });

  it('Toledo (Spain)', function() {
    var section = {
      text: '<ul><li id="mwBRM"><a href="/wiki/Toledo_(Spain)" title="Toledo (Spain)">Toledo</a> — A UNESCO World Heritage site. Medieval walled city and former capital of Spain. It\'s about a 30 minute train ride from Madrid Atocha station, with plenty of art (del Greco) and architecture (one of the best cathedrals in Europe) so very worthy of a day trip but more worthy of a night. But it is on the late spring and the early summer nights that it reaches its beauty peak, simply breathtaking, do not miss it.</li></ul>'
    };

    section = extract( section );
    assert.strictEqual( section.destinations.length, 1 );
    assert.strictEqual( section.destinations[0].title, 'Toledo (Spain)' );
    assert.ok( section.text.indexOf( '30 minute train ride' ) === -1 );
  });

  it('Sacramento', function() {
    var section = {
      text: '<ul><li id="mwA"><a href="/wiki/Sacramento" title="Sacramento">Sacramento</a>, the California state capital with excellent restaurants and attractions</li></ul>'
    };

    section = extract( section );
    assert.ok( section.text.indexOf( 'California state capital' ) === -1 );
  });

  it('Bordeaux', function() {
    var section = {
      text: '<ul><li id="mwAV8"> <b>North</b>: The  Medoc region, where some of the famous Bordeaux wines are produced. The first growths Château Lafite Rothschild, Chateau Latour, Château Margaux and Chateau Mouton Rothschild are all located in the Medoc. If you are planning a tour to a chateau, keep the following in mind: (1) call ahead and make a reservation; (2) Chateau Latour generally only accepts serious collectors and professionals; and (3) Chateau Mouton Rothschild is closed for renovation during 2010, the chai is a five-meter hole as of this writing.</li><li id="mwBMA"> Eveux, about 20 km northwest of Lyon is home to the <b>Sainte Marie de La Tourette</b> convent. Designed by Le Corbusier, it\'s one of 17 of his works worldwide to be listed as a <a href="/wiki/World_heritage_site" title="World heritage site">world heritage site</a>.</li></ul>'
    };

    section = extract( section );
    assert.strictEqual( section.destinations.length, 0 );
  });

  it('London', function() {
    var section = {
      text: '<ul><li id="mwCZA"> <a href="/wiki/Stonehenge" title="Stonehenge">Stonehenge</a>. Among the most famous landmarks in England. The mysterious stone ring was built thousands of years ago, today it is a <a href="/wiki/UNESCO_World_Heritage_Site" title="UNESCO World Heritage Site">UNESCO World Heritage Site</a>. You can get there by a guided bus tour or by train (1 hr 30) to the nearby city <a href="/wiki/Salisbury_(England)" title="Salisbury (England)">Salisbury</a>, where you can also visit the 13th-century cathedral with the highest spire in the country.</li><li id="mwCZk"> <a href="/wiki/Southend-on-Sea" title="Southend-on-Sea">Southend-on-Sea</a>. An <a href="/wiki/Essex_(England)" title="Essex (England)">Essex</a> seaside town with pebble and sand beaches, fairground rides, arcades, and the longest pier in the world. Make sure to grab yourself a delicious Rossi ice cream - a local delicacy since 1932 - while you\'re there! Only 40 minutes by train from Fenchurch Street station.</li><li id="mwCXo"> <a href="/wiki/Paris" title="Paris">Paris</a> (<a href="/wiki/France" title="France">France</a>). Only 2 hours via Eurostar from St. Pancras station. </li></ul>'
    };

    section = extract( section );
    assert.strictEqual( section.destinations.length, 3 );
    assert.strictEqual( section.destinations[0].title, 'Stonehenge' );
    assert.strictEqual( section.destinations[0].description,
      'Among the most famous landmarks in England. The mysterious stone ring was built thousands of years ago, today it is a UNESCO World Heritage Site. You can get there by a guided bus tour or by train (1 hr 30) to the nearby city Salisbury, where you can also visit the 13th-century cathedral with the highest spire in the country.' );
    assert.strictEqual( section.destinations[2].description,
      'Only 2 hours via Eurostar from St. Pancras station.' );
    assert.ok( section.text.indexOf( 'Stonehenge' ) === -1 );
    assert.ok( section.text.indexOf( 'Southend' ) === -1 );
    assert.ok( section.text.indexOf( 'Paris' ) === -1 );
  });

  it('Nairobi', function() {
    var section = {
      text: '<ul><li id="mwAmw"> <a href="/wiki/Lake_Naivasha" title="Lake Naivasha">Lake Naivasha</a> is worth at least a day\'s visit and has enough to keep you occupied for two or three days. Lakeshore country clubs are a good place for lunch. You can take a boat ride on the lake to see hippos, go for a walk among zebra and giraffes on Crescent Island, ride thoroughbred horses among zebra, giraffes and wildebeest at the Sanctuary Farm, and ride bicycles among wildlife and dramatic scenery at Hell\'s Gate National Park.</li><li id="mwAm4"> <a href="/wiki/Nakuru_National_Park" title="Nakuru National Park">Nakuru National Park</a>, although further afield, deservedly warrants a 1-night stay for a late-afternoon and early-morning game drive.</li></ul>'
    };

    section = extract( section );
    assert.strictEqual( section.destinations.length, 2 );
    assert.strictEqual( section.destinations[1].description,
      'although further afield, deservedly warrants a 1-night stay for a late-afternoon and early-morning game drive.' );
    assert.ok( section.text.indexOf( 'Nakuru National Park' ) === -1 );
  });

  it('Marrakech', function() {
    var section = {
      text: '<ul><li id="mwArI"> <span class="vcard"><span><span class="noprint listing-coordinates" style="display:none"><span class="geo"><abbr class="latitude">31.2171012</abbr><abbr class="longitude">-8.2332754</abbr></span></span><span><a class="mw-kartographer-maplink mw-kartographer-autostyled" mw-data="interface" data-style="osm-intl" href="/wiki/Special:Map/17/31.2171012/-8.2332754" data-zoom="17" data-lat="31.2171012" data-lon="-8.2332754" style="background: #228B22;" data-overlays="[&quot;mask&quot;,&quot;around&quot;,&quot;buy&quot;,&quot;city&quot;,&quot;do&quot;,&quot;drink&quot;,&quot;eat&quot;,&quot;go&quot;,&quot;listing&quot;,&quot;other&quot;,&quot;see&quot;,&quot;sleep&quot;,&quot;vicinity&quot;,&quot;view&quot;,&quot;black&quot;,&quot;blue&quot;,&quot;brown&quot;,&quot;chocolate&quot;,&quot;forestgreen&quot;,&quot;gold&quot;,&quot;gray&quot;,&quot;grey&quot;,&quot;lime&quot;,&quot;magenta&quot;,&quot;maroon&quot;,&quot;mediumaquamarine&quot;,&quot;navy&quot;,&quot;orange&quot;,&quot;plum&quot;,&quot;purple&quot;,&quot;red&quot;,&quot;royalblue&quot;,&quot;silver&quot;,&quot;steelblue&quot;,&quot;teal&quot;]">1</a><span></span><span> </span></span><span class="fn org listing-name"><b><a href="/wiki/Amizmiz" title="Amizmiz">Amizmiz</a></b></span></span>.  <span class="note listing-content">With one of the largest Berber souks in the <a href="/wiki/High_Atlas" title="High Atlas">High Atlas</a> Mountains every Tuesday, Amizmiz is well-worth a trip. This is especially true for those travelers wishing to experience the less urban, less touristy mountain towns of the High Atlas. The souk itself deals mostly in the ordinary household goods that any Walmart does; plan your souvenir shopping elsewhere.</span><span class="listing-metadata"><span class="listing-metadata-items"><span>&nbsp;</span></span></span></span></li></ul>'
    };

    section = extract( section );
    assert.strictEqual( section.destinations.length, 1 );
    assert.ok( section.text.indexOf( 'High Atlas' ) === -1 );
  });

  it('Nha Trang', function() {
    var section = {
      text: '<div><ul><li id="mwAmY"> <a href="/wiki/Nha_Trang" title="Nha Trang">Nha Trang</a> - Vietnam\'s premier beach resort town and the next stop for backpackers travelling south on the open bus or train.</li></ul></div>'
    };

    section = extract( section );
    assert.strictEqual( section.destinations.length, 1 );
    assert.strictEqual( section.destinations[0].title, 'Nha Trang' );
    assert.strictEqual( section.destinations[0].description,
      'Vietnam\'s premier beach resort town and the next stop for backpackers travelling south on the open bus or train.' );
    assert.ok( section.text.indexOf( 'backpackers travelling south' ) === -1 );
  });

  it('Santiago de Chile', function() {
    var section = {
      text: '<div><ul><li id="mwAbI">The villages and towns in the surrounding Maipo valley is also a great place for seeing the Chilean way of life, buying handicrafts, tasting <a href="./Wine" title="Wine">wine</a> and savoring local cuisine.</li></ul></div>'
    };

    section = extract( section );
    assert.strictEqual( section.destinations.length, 0 );
  });

  it('Morgantown', function() {
    var section = {
      text: '<div><ul><li id="mwAUo"> <a href="http://www.prickettsfortstatepark.com/">Prickett\'s Fort State Park</a> - State park located in Fairmont, WV. 15 miles south of Morgantown on I-79.</li></ul></div>'
    };

    section = extract( section );
    assert.strictEqual( section.destinations.length, 0, 'External links ignored' );
    assert.ok( section.text.indexOf( 'Prickett' ) === -1, 'External link listings are stripped' );
  });

  it('East Midlands', function() {
    var section = {
      text: '<div><ul><li id="mwDA"><a href="Derby" title="Derby">Derby</a> (Derbyshire)</li><li id="mwDg"><a href="Leicester" title="Leicester">Leicester</a> (Leicestershire)</li><li id="mwEA"><a href="Lincoln" title="Lincoln">Lincoln</a> (Lincolnshire)</li><li id="mwEg"><a href="Nottingham" title="Nottingham">Nottingham</a> (Nottinghamshire)</li></ul></div>'
    };

    section = extract( section );
    assert.strictEqual( section.destinations.length, 4 );
    assert.ok( section.text.indexOf( 'Derby' ) === -1 );
  });

  it('Brescia', function() {
    var section = {
      text: '<div><p>The <i><a href="/wiki/Franciacorta" title="Franciacorta">Franciacorta</a></i> region south of the Lake Iseo boasts opportunities to taste some of the finest (and most expensive) <a href="https://en.wikipedia.org/wiki/Franciacorta_DOCG" class="extiw" title="w:Franciacorta DOCG">wines</a> in Italy, as well as tour vineyards and cantinas.</p></div>'
    };

    section = extract( section );
    assert.strictEqual( section.destinations.length, 1 );
    assert.strictEqual( section.destinations[0].title, 'Franciacorta' );
  });

  it('Carribean', function() {
    var section = {
      text: '<div><ul><li id="mwnQ"><a href="/wiki/Gran_Parque_Natural_Topes_de_Collantes" title="Gran Parque Natural Topes de Collantes">Gran Parque Natural Topes de Collantes</a> in <a href="/wiki/Central_Cuba" title="Central Cuba">Central Cuba</a></li><li id="mwsg"><a href="/wiki/Morne_Trois_Pitons_National_Park" title="Morne Trois Pitons National Park">Morne Trois Pitons National Park</a> on <a href="/wiki/Dominica" title="Dominica">Dominica</a> featuring the Boiling Lake, the world\'s second largest geyser.</li></ul></div>'
    };

    section = extract( section );
    assert.strictEqual( section.destinations.length, 2 );
    assert.strictEqual( section.destinations[0].title, 'Gran Parque Natural Topes de Collantes' );
    assert.strictEqual( section.destinations[1].title, 'Morne Trois Pitons National Park' );
    assert.ok( section.text.indexOf( 'Gran Parque Natural' ) === -1 );
    assert.ok( section.text.indexOf( 'Boiling Lake' ) === -1 );
  });

  it('Egypt', function() {
    var section = {
      text: '<div><ul><li> <a href="/wiki/Sudan" title="Sudan">Sudan</a></li><li> <a href="/wiki/Gaza_Strip" title="Gaza Strip">The Gaza Strip</a></li></ul></div>'
    };

    section = extract( section );
    assert.strictEqual( section.destinations.length, 2 );
    assert.strictEqual( section.destinations[0].title, 'Sudan' );
    assert.strictEqual( section.destinations[0].description, undefined );
    assert.ok( section.text.indexOf( 'Sudan' ) === -1 );
    assert.ok( section.text.indexOf( 'Gaza' ) === -1 );
  });

  it( 'Lisbon', function() {
    var section = {
      text: '<div><ul><li id="mwBM8"> <a href="Almada" title="Almada">Almada</a> - a city connected to/from Lisbon via ferry boats at <a href="Cacilhas" title="Cacilhas">Cacilhas</a> and connected by train at <a href="Pragal" title="Pragal">Pragal</a> and roadway via 25 Abril bridge/ponte 25 de Abril.  The Monument of Christ-King (Cristo-Rei) is located in Pragal, Almada.</li></ul></div>'
    };
    section = extract( section );
    assert.strictEqual( section.destinations[0].title, 'Almada' );
    assert.ok( section.text.indexOf( 'Almada' ) === -1 );
    
  });

  it('San Francisco', function() {
    var section = {
      text: '<div><div>\n<p>Bikes can be rented from around the northern waterfront (Pier 41/Fisherman\'s Wharf/Aquatic Park area) or near Golden Gate Park for trips to <a href="/wiki/Marin_County" title="Marin County">Marin County</a> via the Golden Gate Bridge. Stanyan near Haight at the end of the park has several good shops.\nGolden Gate Transit also sporadically serves the North Bay from San Francisco, and has bike racks on most buses.</p>\n\n<p>Nearby destinations suitable for day trips include:</p>\n\n<ul><li id="mwBKQ"> <b><a href="/wiki/Oakland" title="Oakland">Oakland</a></b> — A diverse and vibrant city, Oakland was once considered San Francisco\'s "sister city," and has been regaining that title in recent years due to a general renaissance of the city. Although not a major tourist destination, it\'s worth a visit for its many distinct and charming neighborhoods.</li>\n<li id="mwBKc"> <b><a href="/wiki/Berkeley_(California)" title="Berkeley (California)">Berkeley</a></b> —  Home to the University of California, Berkeley and one of the nation\'s most progressive communities.  Also a hub of liberal political activism for the past several decades. It is also home to quite a few superb restaurants.</li>\n<li id="mwBKo"> <b><a href="/wiki/Sausalito" title="Sausalito">Sausalito</a></b> — Enjoy a ferry ride across the bay to beautiful Sausalito where you can walk along the water and admire the San Francisco skyline.  Stroll to the waterfront restaurants, shops, and galleries.</li>\n<li id="mwBK0"> <b><a href="/wiki/Healdsburg" title="Healdsburg">Healdsburg</a></b> — A charming Wine Country town located among some of California\'s greatest wine appellations: Alexander Valley, Dry Creek Valley, Russian River Valley and Chalk Hill. Relaxed yet sophisticated atmosphere, with excellent restaurants, shopping and wine tasting. About 70 miles north of the Golden Gate Bridge.</li>\n<li id="mwBLA"> <b><a href="/wiki/Napa_Valley" title="Napa Valley">Napa Valley</a></b> —  The main wine growing region in the United States, a trip to the many wineries makes for a fun day, while those wanting a longer adventure can relax in any one of the many spas, bed and breakfasts, or other lodging options.</li>\n<li id="mwBLM"> <b><a href="/wiki/Muir_Woods" title="Muir Woods">Muir Woods</a></b> — A 560-acre forest of old-growth redwood trees located in <a href="/wiki/Mill_Valley" title="Mill Valley">Mill Valley</a> just north of the Golden Gate Bridge, Muir Woods is a pleasant respite from the city, and accessible by Golden Gate Transit on summer weekends.</li>\n<li id="mwBLc"> <b><a href="/wiki/Point_Reyes_National_Seashore" title="Point Reyes National Seashore">Point Reyes National Seashore</a></b> — Located just north of San Francisco along the <a href="/wiki/Pacific_Coast_Highway" title="Pacific Coast Highway">Pacific Coast Highway</a> (State Highway 1), Point Reyes is a beautiful seashore that is particularly nice to visit when gray whales are migrating along the coast, usually best in mid-January and then from March through May.</li>\n<li id="mwBLs"> <b><a href="/wiki/Peninsula_(Bay_Area)" title="Peninsula (Bay Area)">Peninsula</a></b> — Just south of San Francisco, the peninsula has excellent nature preserves.\n<ul><li id="mwBL8"> <b><a href="/wiki/Palo_Alto" title="Palo Alto">Palo Alto</a></b> — On the Peninsula south of the city, Palo Alto has some of the richest neighborhoods in all of California and makes for a beautiful drive with views of the coastline and magnificent mansions.</li>\n<li id="mwBMI"> <b><a href="/wiki/Burlingame" title="Burlingame">Burlingame</a></b> — Another well off neighborhood on the Peninsula, Burlingame has a lovely downtown area with plenty of shops, dining and streets lined with cypress trees.</li></ul></li>\n<li id="mwBMU"> <b><a href="/wiki/Monterey_(California)" title="Monterey (California)">Monterey</a></b> — An otherwise quiet beach town home to one of the country\'s best aquariums. </li>\n<li id="mwBMg"> <b><a href="/wiki/Santa_Cruz_(California)" title="Santa Cruz (California)">Santa Cruz</a></b> —  Located on the coast north of <a href="/wiki/Monterey_(California)" title="Monterey (California)">Monterey Bay</a>, this funky town is home to surfers, the beautiful and tech-savvy University of California, Santa Cruz, and a popular boardwalk.  The Santa Cruz Mountains north of town are a great place for outdoor recreation such as hiking, and home to misty forests of famous, enormous redwood trees.</li>\n<li id="mwBMw"> <b><a href="/wiki/Vallejo" title="Vallejo">Vallejo</a></b> — Home to a wildlife theme park, Six Flags Discovery Kingdom.</li>\n<li id="mwBM8"> <b><a href="/wiki/Yosemite_National_Park" title="Yosemite National Park">Yosemite National Park</a></b> — Tours from San Francisco make for a wonderful day trip, although you will spend around 10 hours travelling for less than 4 in the park.  Make sure to visit the amazing Giant Sequoias.</li>\n<li id="mwBNI"> <b><a href="/wiki/Lake_Tahoe" title="Lake Tahoe">Lake Tahoe</a></b> — Buses and one Amtrak train per day link the Bay Area to nearby Truckee, and as with Yosemite, travel even by car to and from would consume much of the day.  However, the spectacular alpine setting and winter ski and snowboard options surrounding the Lake make Tahoe an unforgettable destination. </li>\n<li id="mwBNU"> <b><a href="/wiki/Livermore" title="Livermore">Livermore</a></b> — A suburban city in the East Bay region of the San Francisco Bay Area. The Livermore Valley is "wine country", and produces some of California\'s best wines.</li></ul>\n\n<span>\n</span><table class="routeBox">\n<tbody><tr>\n<td><b>Routes through San Francisco</b></td></tr>\n\n</tbody></table><span>\n</span><p></p><table class="routeBox" style="border: 1px solid #555555;">\n\n<tbody><tr>\n<td style="font-size:smaller; text-align:right;"> <b>END</b>  <span>←</span></td>\n<td style="background-color:#555555; font-size:smaller; color:white; text-align:center;"> <span>&nbsp;</span><b>W</b><span>&nbsp;</span><span><span><img src="//upload.wikimedia.org/wikipedia/commons/thumb/1/11/I-80.svg/22px-I-80.svg.png" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/1/11/I-80.svg/44px-I-80.svg.png 2x, //upload.wikimedia.org/wikipedia/commons/thumb/1/11/I-80.svg/33px-I-80.svg.png 1.5x" height="22" width="22"></span></span><span>&nbsp;</span><b>E</b><span>&nbsp;</span></td>\n<td style="font-size:smaller; text-align:left;"> <span>→</span> <a href="/wiki/Oakland" title="Oakland">Oakland</a> <span>→</span> <b><a href="/wiki/Sacramento" title="Sacramento">Sacramento</a></b></td></tr>\n<tr>\n<td style="font-size:smaller; text-align:right;"> <b>END</b>  <span>←</span></td>\n<td style="background-color:#555555; font-size:smaller; color:white; text-align:center;"> <span>&nbsp;</span><b>N</b><span>&nbsp;</span><span><span><img src="//upload.wikimedia.org/wikipedia/commons/thumb/6/62/I-280.svg/22px-I-280.svg.png" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/6/62/I-280.svg/44px-I-280.svg.png 2x, //upload.wikimedia.org/wikipedia/commons/thumb/6/62/I-280.svg/33px-I-280.svg.png 1.5x" height="18" width="22"></span></span><span>&nbsp;</span><b>S</b><span>&nbsp;</span></td>\n<td style="font-size:smaller; text-align:left;"> <span>→</span> <a href="/wiki/Daly_City" title="Daly City">Daly City</a> <span>→</span> <b><a href="/wiki/San_Jose_(California)" title="San Jose (California)">San Jose</a></b></td></tr>\n<tr>\n<td style="font-size:smaller; text-align:right;"> <b><a href="/wiki/Santa_Rosa_(California)" title="Santa Rosa (California)">Santa Rosa</a></b> <span>←</span> <a href="/wiki/Sausalito" title="Sausalito">Sausalito</a> <span>←</span></td>\n<td style="background-color:#555555; font-size:smaller; color:white; text-align:center;"> <span>&nbsp;</span><b>N</b><span>&nbsp;</span><span><span><img src="//upload.wikimedia.org/wikipedia/commons/thumb/7/79/US_101.svg/22px-US_101.svg.png" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/7/79/US_101.svg/44px-US_101.svg.png 2x, //upload.wikimedia.org/wikipedia/commons/thumb/7/79/US_101.svg/33px-US_101.svg.png 1.5x" height="18" width="22"></span></span><span>&nbsp;</span><b>S</b><span>&nbsp;</span></td>\n<td style="font-size:smaller; text-align:left;"> <span>→</span> <a href="/wiki/Brisbane_(California)" title="Brisbane (California)">Brisbane</a> <span>→</span> <b><a href="/wiki/San_Jose_(California)" title="San Jose (California)">San Jose</a></b></td></tr>\n<tr>\n<td style="font-size:smaller; text-align:right;"> <b><a href="/wiki/Fort_Bragg" title="Fort Bragg">Fort Bragg</a></b> <span>←</span> <a href="/wiki/Sausalito" title="Sausalito">Sausalito</a> ← Merges with <span><a href="/wiki/File:US_101.svg"><img src="//upload.wikimedia.org/wikipedia/commons/thumb/7/79/US_101.svg/18px-US_101.svg.png" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/7/79/US_101.svg/36px-US_101.svg.png 2x, //upload.wikimedia.org/wikipedia/commons/thumb/7/79/US_101.svg/27px-US_101.svg.png 1.5x" height="14" width="18"></a></span> <span>←</span></td>\n<td style="background-color:#555555; font-size:smaller; color:white; text-align:center;"> <span>&nbsp;</span><b>N</b><span>&nbsp;</span><span><span><img src="//upload.wikimedia.org/wikipedia/commons/thumb/d/dd/California_1.svg/22px-California_1.svg.png" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/d/dd/California_1.svg/44px-California_1.svg.png 2x, //upload.wikimedia.org/wikipedia/commons/thumb/d/dd/California_1.svg/33px-California_1.svg.png 1.5x" height="23" width="22"></span></span><span>&nbsp;</span><b>S</b><span>&nbsp;</span></td>\n<td style="font-size:smaller; text-align:left;"> <span>→</span> <a href="/wiki/Daly_City" title="Daly City">Daly City</a> <span>→</span> <b><a href="/wiki/Santa_Cruz_(California)" title="Santa Cruz (California)">Santa Cruz</a></b></td></tr>\n</tbody></table><span>\n</span><p><br>\n\n\n</p>\n\n\n\n\n\n</div></div>'
    };

    section = extract( section );
    assert.strictEqual( section.destinations[0].title, 'Palo Alto' );
    assert.strictEqual( section.destinations[0].description,
      'On the Peninsula south of the city, Palo Alto has some of the richest neighborhoods in all of California and makes for a beautiful drive with views of the coastline and magnificent mansions.' );
    assert.ok( section.text.indexOf( 'Palo Alto has some of the' ) === -1 );
    assert.ok( section.text.indexOf( 'Buses and one Amtrak train per day link' ) === -1 );
    assert.ok( section.text.indexOf( 'the peninsula has excellent nature preserves' ) === -1 );
  });
});

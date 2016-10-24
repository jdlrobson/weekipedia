function Page( opts ) {
  Object.assign( this, opts );
}

Page.prototype = {
  getBias: function () {
    return this.bias;
  },
  age: function () {
    return this._age ? this._age : ( new Date( this.trendedAt ) - new Date( this.start ) ) /
      1000 / 60;
  },
  editsPerMinute: function () {
    var age = this.age(),
      editCount = this.edits;

    return age < 1 || editCount === 0 ? editCount : editCount / age;
  }
};
Page.fromJSON = function ( json ) {
  var d = new Date();
  if ( !json.trendedAt ) {
    json.trendedAt = d.toISOString();
  }
  return new Page( json );
};

var agaricAcid = new Page( {
  anonEdits: 0,
  edits: 60,
  reverts: 13,
  anons: [],
  notabilityFlags: 0,
  volatileFlags: 0,
  views: 0,
  start: '2016-10-13T15:04:47.853Z',
  trendedAt: '2016-10-13T15:22:37.952Z',
  bias: 0.5423728813559322,
  contributors: Array( 9 )
} );

var battleMosul = new Page( {
  anonEdits: 6,
  edits: 34,
  reverts: 2,
  anons: Array( 3 ),
  views: 0,
  notabilityFlags: 0,
  volatileFlags: 0,
  start: "2016-10-18T16:39:59.389Z",
  trendedAt: "2016-10-18T18:03:06.731Z",
  bias: 0.3333333333333333,
  contributors: Array( 11 )
} );

var deaths2016 = new Page( {
  anonEdits: 0,
  edits: 130,
  reverts: 2,
  anons: [],
  views: 9807,
  notabilityFlags: 0,
  volatileFlags: 0,
  start: "2016-10-14T23:35:44.813Z",
  trendedAt: "2016-10-15T00:25:54.960Z",
  bias: 0.15384615384615385,
  contributors: Array( 46 )
} );

var attaUr = new Page( {
  anonEdits: 5,
  anons: Array(2),
  bias: 0.3076923076923077,
  edits: 13,
  reverts: 1,
  start: "2016-10-18T18:13:17.987Z",
  trendedAt: "2016-10-18T20:12:34.933Z",
  contributors: new Array( 4 ),
  views: 0,
  notabilityFlags: 0,
  volatileFlags: 1
} );

var cyberAttacks = new Page( {
  anonEdits: 1,
  anons: new Array(1),
  bias: 0.5172413793103449,
  edits: 29,
  reverts: 1,
  start: '2016-10-21T18:03:51.387Z',
  trendedAt: '2016-10-21T19:02:27.229Z',
  contributors: new Array(4),
  views: 0,
  notabilityFlags: 0,
  volatileFlags: 0
} );

const page = new Page( {
  _age: 3086,
  anonEdits: 0,
  bias: 0.5,
  bytesChanged: 2825,
  anons: new Array(),
  contributors: [ 'a', 'b', 'c', 'd', 'e' ],
  edits: 12,
  notabilityFlags: 0,
  volatileFlags: 1,
  reverts: 1,
  views: 0
} );

const page2 = new Page( {
  _age: 4096,
  anonEdits: 13,
  bias: 0.1,
  bytesChanged: 606,
  anons: new Array(),
  contributors: [ 'a', 'b', 'c', 'd', 'e', 'f', 'g' ],
  edits: 20,
  notabilityFlags: 0,
  volatileFlags: 0,
  reverts: 3,
  views: 0
} );

const page3 = new Page( {
  _age: 10235,
  anonEdits: 14,
  edits: 65,
  anons: new Array(),
  contributors: new Array( 25 ),
  bias: 0.26153846153846155,
  bytesChanged: 4830,
  reverts: 1,
  views: 0,
  notabilityFlags: 0,
  volatileFlags: 0
} );

const page4 = new Page( {
  _age: 10114,
  anonEdits: 3,
  edits: 65,
  anons: new Array(),
  contributors: new Array( 16 ),
  bias: 0.265625,
  bytesChanged: 2382,
  reverts: 2,
  visits: 0,
  notabilityFlags: 0,
  volatileFlags: 0
} );

const Hoboken = Page.fromJSON(
  {"title":"Hoboken Terminal","edits":14,"anonEdits":10,"isNew":false,"notabilityFlags":1,"volatileFlags":0,"reverts":0,"start":"2016-09-29T13:32:52.189Z","updated":"2016-09-29T14:17:20.987Z","contributors":["DanTD","Nick Cooper","Realkyhick"],"anons":["66.228.83.116","2600:1000:B129:C270:8CD2:437:6333:56D6","2600:1012:B01D:10A9:2090:CB9F:BDC8:50FB"],"distribution":{"66.228.83.116":8,"2600:1000:B129:C270:8CD2:437:6333:56D6":1,"2600:1012:B01D:10A9:2090:CB9F:BDC8:50FB":1,"DanTD":2,"Nick Cooper":1,"Realkyhick":1},"bytesChanged":690,"id":"Hoboken Terminal","wiki":"enwiki","views":0,"score":-1.4363777908898543,"lang":"en","safe":true,"lastIndex":50,"index":1,"bestIndex":1,"bias":0.5714285714285714,"thumbnail":{"source":"https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Hoboken_Terminal_waitingroom.jpg/120px-Hoboken_Terminal_waitingroom.jpg","width":120,"height":90}}
);

const ShimonPeres = Page.fromJSON(
  {"title":"Shimon Peres","edits":224,"anonEdits":0,"isNew":false,"notabilityFlags":0,"volatileFlags":0,"reverts":11,"start":"2016-09-28T01:15:13.292Z","updated":"2016-09-29T14:21:18.999Z","contributors":["Psteinb","Nutmeg39","HC0502","Howardform","Adog104","To4evr","EdChem","SomePseudonym","Jprg1966","Connormah","Mrceleb2007","Ad Orientem","Graham87","Muboshgu","Valfontis","Knowitall369","Ethangunit","Etamni","Light show","Notecardforfree","Yomybrotha","Stephen","All Hallow's Wraith","Avaya1","Gilabrand","Tobby72","J budissin","DGtal","Valentina Cardoso","Nim205","Aquilasilex","Xyzspaniel","Eitan1989","Deb","Kndimov","Harfarhs","Ajax1995","Yojimbo1941","Cheep","Ericamick","Kremnica","Anonymous from the 21st century","Irondome","MisfitToys","RayneVanDunem","Wavelength","725edwards","Fixuture","Jonathunder","Okedem","Cliftonian","DocWatson42","Cyve","Panam2014","ChefNathan"],"anons":[],"distribution":{"Psteinb":1,"Nutmeg39":3,"HC0502":1,"Howardform":1,"Adog104":12,"To4evr":1,"EdChem":21,"SomePseudonym":1,"Jprg1966":2,"Connormah":4,"Mrceleb2007":1,"Ad Orientem":2,"Graham87":2,"Muboshgu":9,"Valfontis":1,"Knowitall369":8,"Ethangunit":1,"Etamni":1,"Light show":14,"Notecardforfree":1,"Yomybrotha":1,"Stephen":2,"All Hallow's Wraith":2,"Avaya1":90,"Gilabrand":2,"Tobby72":1,"J budissin":2,"DGtal":1,"Valentina Cardoso":3,"Nim205":1,"Aquilasilex":1,"Xyzspaniel":1,"Eitan1989":1,"Deb":1,"Kndimov":1,"Harfarhs":1,"Ajax1995":1,"Yojimbo1941":1,"Cheep":1,"Ericamick":1,"Kremnica":5,"Anonymous from the 21st century":3,"Irondome":6,"MisfitToys":2,"RayneVanDunem":1,"Wavelength":2,"725edwards":1,"Fixuture":1,"Jonathunder":4,"Okedem":1,"Cliftonian":3,"DocWatson42":1,"Cyve":1,"Panam2014":1,"ChefNathan":1},"bytesChanged":16691,"id":"Shimon Peres","wiki":"enwiki","views":254906,"score":709106.0076666668,"lang":"en","safe":true,"trendedAt":"2016-09-28T02:02:09.730Z","thumbnail":{"source":"https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Shimon_Peres_in_Brazil.jpg/82px-Shimon_Peres_in_Brazil.jpg","width":82,"height":120},"description":"Israeli politician, 8th prime minister and 9th president of Israel","lastIndex":1,"index":1,"bestIndex":1,"bias":0.4017857142857143}
);

const Liliuokalani = Page.fromJSON({"title":"Liliuokalani","edits":205,"anonEdits":1,"isNew":false,"notabilityFlags":0,"volatileFlags":0,"reverts":3,"start":"2016-09-26T23:37:49.317Z","updated":"2016-09-29T08:35:11.264Z","contributors":["Mark Miller","KAVEBEAR","Maile66","Kaldari"],"anons":["204.154.122.65"],"distribution":{"Mark Miller":92,"KAVEBEAR":102,"204.154.122.65":1,"Maile66":12,"Kaldari":1},"bytesChanged":20207,"id":"Liliuokalani","wiki":"enwiki","views":0,"score":6.514579096810549e-185,"lang":"en","safe":true,"lastIndex":7,"index":1,"bestIndex":1,"bias":0.4975609756097561,"thumbnail":{"source":"https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Queen_Liliuokalani.jpg/97px-Queen_Liliuokalani.jpg","width":97,"height":120},"description":"last monarch of the Kingdom of Hawaii"});


const PacificTyphoon = Page.fromJSON({"title":"2016 Pacific typhoon season","edits":145,"anonEdits":35,"isNew":false,"notabilityFlags":0,"volatileFlags":0,"reverts":9,"start":"2016-09-23T01:17:09.187Z","updated":"2016-09-29T14:52:38.307Z","contributors":["Meow","About123","AlphaBetaGamma01","Kaihsu","LilHelpa","Jasper Deng","CVQT","KN2731","Nino Marakot","Typhoon2013","Shubbs03","Skycycle","Jason Rees","2601:547:1102:EFAF:5582:22E2:D524:4E3C","MarioProtIV","Floatjon","Jdcomix"],"anons":["67.224.154.107","60.246.51.20","14.182.204.172","63.135.255.94","219.79.180.157","2607:FB90:82:1850:0:2:FEE2:2A01","60.246.138.64","124.104.166.192","219.79.251.73","219.79.250.237","2600:387:9:5:0:0:0:62","72.50.81.129"],"distribution":{"Meow":38,"About123":10,"AlphaBetaGamma01":3,"67.224.154.107":1,"Kaihsu":2,"LilHelpa":1,"Jasper Deng":6,"CVQT":2,"KN2731":1,"Nino Marakot":2,"60.246.51.20":1,"Typhoon2013":40,"14.182.204.172":6,"63.135.255.94":1,"219.79.180.157":3,"2607:FB90:82:1850:0:2:FEE2:2A01":3,"60.246.138.64":10,"Shubbs03":2,"Skycycle":3,"Jason Rees":1,"124.104.166.192":3,"219.79.251.73":1,"219.79.250.237":3,"2600:387:9:5:0:0:0:62":1,"72.50.81.129":2,"2601:547:1102:EFAF:5582:22E2:D524:4E3C":4,"MarioProtIV":1,"Floatjon":2,"Jdcomix":1},"bytesChanged":10039,"id":"2016 Pacific typhoon season","wiki":"enwiki","views":0,"score":0,"lang":"en","safe":true,"lastIndex":11,"index":1,"bestIndex":1,"bias":0.27586206896551724,"thumbnail":{"source":"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2016_Pacific_typhoon_season_summary.png/120px-2016_Pacific_typhoon_season_summary.png","width":120,"height":108}});

const CascadeMall = Page.fromJSON({"title":"2016 Cascade Mall shooting","edits":84,"anonEdits":13,"isNew":false,"notabilityFlags":0,"volatileFlags":0,"reverts":8,"start":"2016-09-25T17:58:53.171Z","updated":"2016-09-29T13:54:04.066Z","contributors":["Mapabo","General Ization","Epson Salts","Lyttle-Wight","MrX","2602:30A:2CE8:44BF:6091:9A35:D503:7B51","Jim Michael","Sally882","NotTheFakeJTP","Ansh666","G0T0","Kelisi","Ferakp","Anthon.Eff","FallingGravity","FriarTuck1981","Somedifferentstuff","Yellowdesk","EvergreenFir","Frietjes","Corn cheese","Parsley Man"],"anons":["2602:304:CFD0:6350:A975:93E1:5CF:D334","108.59.74.107","2601:3C5:8200:B79:E8FC:561:930C:D222","24.68.85.72","95.133.211.190","75.66.124.118","2001:569:705D:8700:2190:EDAA:E346:B3FB","138.75.147.110","82.22.113.75"],"distribution":{"Mapabo":2,"General Ization":12,"Epson Salts":1,"Lyttle-Wight":2,"2602:304:CFD0:6350:A975:93E1:5CF:D334":2,"MrX":2,"108.59.74.107":1,"2602:30A:2CE8:44BF:6091:9A35:D503:7B51":1,"Jim Michael":4,"Sally882":7,"2601:3C5:8200:B79:E8FC:561:930C:D222":1,"NotTheFakeJTP":1,"Ansh666":1,"24.68.85.72":1,"G0T0":15,"95.133.211.190":2,"Kelisi":1,"75.66.124.118":3,"2001:569:705D:8700:2190:EDAA:E346:B3FB":1,"Ferakp":1,"Anthon.Eff":1,"FallingGravity":2,"FriarTuck1981":1,"Somedifferentstuff":20,"138.75.147.110":1,"Yellowdesk":1,"EvergreenFir":1,"Frietjes":1,"82.22.113.75":1,"Corn cheese":1,"Parsley Man":1},"bytesChanged":4729,"id":"2016 Cascade Mall shooting","wiki":"enwiki","views":0,"score":1.981236333844914e-274,"lang":"en","safe":true,"lastIndex":22,"index":1,"bestIndex":1,"bias":0.23809523809523808,"thumbnail":{"source":"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/USA_Washington_location_map.svg/120px-USA_Washington_location_map.svg.png","width":120,"height":85}})

const WideAreaNetwork = Page.fromJSON( {"edits":11,"anonEdits":1,"isVandalism":false,"isNew":false,"isVolatile":false,"reverts":2,"start":"2016-10-21T09:03:20.382Z","contributors":["MY C0CK","MY D1CK","Batman12345678910111213"],"anons":["213.81.68.133"],"distribution":{"MY C0CK":3,"MY D1CK":1,"Batman12345678910111213":6,"213.81.68.133":1},"speed":0.8809384931413599,"anonAuthors":1,"uniqueAuthors":3,"duration":12.476833333333333,"bias":0.5454545454545454,"level":3,"trendedAt":"2016-10-21T09:15:49.583Z"});

const AmericanFootball = Page.fromJSON( {"edits":14,"anonEdits":0,"isVandalism":false,"isNew":false,"isVolatile":false,"reverts":0,"start":"2016-10-21T03:12:25.982Z","contributors":["BelAirRuse","Lizard the Wizard","WikiOriginal-9","BilCat"],"anons":[],"distribution":{"BelAirRuse":5,"Lizard the Wizard":3,"WikiOriginal-9":5,"BilCat":1},"speed":0.30679283156635273,"anonAuthors":0,"uniqueAuthors":4,"duration":45.56015,"bias":0.35714285714285715,"level":3,"trendedAt":"2016-10-21T03:58:03.986Z"});

const JoanneAlbum = Page.fromJSON( {"edits":11,"anonEdits":0,"isVandalism":false,"isNew":false,"isVolatile":false,"reverts":0,"start":"2016-10-21T16:48:31.642Z","contributors":["Chasewc91","SNUGGUMS", "Another Believer","Yamenezes","IndianBio","Eliassarris"],"anons":[],"distribution":{"Chasewc91":2,"Another Believer":2,"Yamenezes":1,"IndianBio":3,"Eliassarris":1},"speed":0.4780639472500699,"anonAuthors":0,"uniqueAuthors":5,"duration":18.57825,"bias":0.3333333333333333,"level":3,"trendedAt":"2016-10-21T17:16:21.198Z"})

const NintendoSwitch = Page.fromJSON( {"edits":9,"anonEdits":2,"isVandalism":false,"isNew":false,"isVolatile":false,"reverts":0,"start":"2016-10-20T14:06:08.529Z","contributors":["Kmkearney","Wonchop","Ferret","Magegg","Masem"],"anons":["66.87.121.70","121.45.210.203"],"distribution":{"Kmkearney":1,"66.87.121.70":1,"Wonchop":3,"Ferret":1,"Magegg":1,"Masem":1,"121.45.210.203":1},"speed":0.5575793621292097,"anonAuthors":2,"uniqueAuthors":5,"duration":15.977233333333334,"bias":0.3333333333333333,"level":3,"trendedAt":"2016-10-20T14:22:17.001Z"});

const PeteBurns = Page.fromJSON({"title":"Pete Burns","edits":46,"anonEdits":23,"isNew":false,"notabilityFlags":0,"volatileFlags":0,"reverts":2,"start":"2016-10-24T17:30:59.042Z","updated":"2016-10-24T18:00:15.331Z","contributors":["Hip2020","Anonymous from the 21st century","5 albert square","Doc Strange","BabbaQ","Ivahhc","TheSturgenator"],"anons":["2A02:C7D:3151:5000:753F:7CDC:E77:460F","92.29.47.141","47.202.128.159","86.167.32.125","93.83.39.197","82.132.240.3","71.176.19.149","79.67.215.22","79.76.141.215","178.78.94.227","2A02:C7F:922B:D300:8D16:E2E9:6DA4:E26B","79.68.10.120","92.239.17.215","31.185.159.163"],"distribution":{"2A02:C7D:3151:5000:753F:7CDC:E77:460F":2,"92.29.47.141":2,"Hip2020":2,"Anonymous from the 21st century":13,"47.202.128.159":5,"86.167.32.125":1,"5 albert square":2,"93.83.39.197":1,"82.132.240.3":3,"Doc Strange":3,"71.176.19.149":1,"79.67.215.22":1,"79.76.141.215":2,"BabbaQ":2,"Ivahhc":2,"178.78.94.227":1,"TheSturgenator":1,"2A02:C7F:922B:D300:8D16:E2E9:6DA4:E26B":1,"79.68.10.120":1,"92.239.17.215":1,"31.185.159.163":1},"bytesChanged":435,"id":"Pete Burns","wiki":"enwiki","views":0,"score":23138.330546542278,"lang":"en","bias":0.2826086956521739,"lastIndex":51,"index":1,"thumbnail":{"source":"https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Pete_Burns_2012.jpg/80px-Pete_Burns_2012.jpg","width":80,"height":120},"description":"English singer-songwriter"});

export { agaricAcid, battleMosul, deaths2016,
  CascadeMall,PacificTyphoon, Liliuokalani, ShimonPeres, Hoboken,
  WideAreaNetwork, AmericanFootball, JoanneAlbum, NintendoSwitch,
  PeteBurns,
  attaUr, cyberAttacks, page, page2, page3, page4 }

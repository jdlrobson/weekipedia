var assert = require( 'assert' );

import calcScore from './../../../../libs/server/endpoints/trending/scoring.js'

var MockPage = function ( data ) {
  var key;
  for ( key in data ) {
    if ( data.hasOwnProperty( key ) ) {
      this[key] = data[key];
    }
  }
};
MockPage.prototype.getBias = function() {
  return this.bias;
}
MockPage.prototype.age = function() {
  return this._age;
}

MockPage.fromJSON = function ( json ) {
  var page = new MockPage( json );
  page._age = ( new Date() - new Date(json.start) ) / 1000 / 60;
  return page;
};

const page = new MockPage( {
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

const page2 = new MockPage( {
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

const page3 = new MockPage( {
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

const page4 = new MockPage( {
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

const Hoboken = MockPage.fromJSON(
  {"title":"Hoboken Terminal","edits":14,"anonEdits":10,"isNew":false,"notabilityFlags":1,"volatileFlags":0,"reverts":0,"start":"2016-09-29T13:32:52.189Z","updated":"2016-09-29T14:17:20.987Z","contributors":["DanTD","Nick Cooper","Realkyhick"],"anons":["66.228.83.116","2600:1000:B129:C270:8CD2:437:6333:56D6","2600:1012:B01D:10A9:2090:CB9F:BDC8:50FB"],"distribution":{"66.228.83.116":8,"2600:1000:B129:C270:8CD2:437:6333:56D6":1,"2600:1012:B01D:10A9:2090:CB9F:BDC8:50FB":1,"DanTD":2,"Nick Cooper":1,"Realkyhick":1},"bytesChanged":690,"id":"Hoboken Terminal","wiki":"enwiki","views":0,"score":-1.4363777908898543,"lang":"en","safe":true,"lastIndex":50,"index":1,"bestIndex":1,"bias":0.5714285714285714,"thumbnail":{"source":"https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Hoboken_Terminal_waitingroom.jpg/120px-Hoboken_Terminal_waitingroom.jpg","width":120,"height":90}}
);

const ShimonPeres = MockPage.fromJSON(
  {"title":"Shimon Peres","edits":224,"anonEdits":0,"isNew":false,"notabilityFlags":0,"volatileFlags":0,"reverts":11,"start":"2016-09-28T01:15:13.292Z","updated":"2016-09-29T14:21:18.999Z","contributors":["Psteinb","Nutmeg39","HC0502","Howardform","Adog104","To4evr","EdChem","SomePseudonym","Jprg1966","Connormah","Mrceleb2007","Ad Orientem","Graham87","Muboshgu","Valfontis","Knowitall369","Ethangunit","Etamni","Light show","Notecardforfree","Yomybrotha","Stephen","All Hallow's Wraith","Avaya1","Gilabrand","Tobby72","J budissin","DGtal","Valentina Cardoso","Nim205","Aquilasilex","Xyzspaniel","Eitan1989","Deb","Kndimov","Harfarhs","Ajax1995","Yojimbo1941","Cheep","Ericamick","Kremnica","Anonymous from the 21st century","Irondome","MisfitToys","RayneVanDunem","Wavelength","725edwards","Fixuture","Jonathunder","Okedem","Cliftonian","DocWatson42","Cyve","Panam2014","ChefNathan"],"anons":[],"distribution":{"Psteinb":1,"Nutmeg39":3,"HC0502":1,"Howardform":1,"Adog104":12,"To4evr":1,"EdChem":21,"SomePseudonym":1,"Jprg1966":2,"Connormah":4,"Mrceleb2007":1,"Ad Orientem":2,"Graham87":2,"Muboshgu":9,"Valfontis":1,"Knowitall369":8,"Ethangunit":1,"Etamni":1,"Light show":14,"Notecardforfree":1,"Yomybrotha":1,"Stephen":2,"All Hallow's Wraith":2,"Avaya1":90,"Gilabrand":2,"Tobby72":1,"J budissin":2,"DGtal":1,"Valentina Cardoso":3,"Nim205":1,"Aquilasilex":1,"Xyzspaniel":1,"Eitan1989":1,"Deb":1,"Kndimov":1,"Harfarhs":1,"Ajax1995":1,"Yojimbo1941":1,"Cheep":1,"Ericamick":1,"Kremnica":5,"Anonymous from the 21st century":3,"Irondome":6,"MisfitToys":2,"RayneVanDunem":1,"Wavelength":2,"725edwards":1,"Fixuture":1,"Jonathunder":4,"Okedem":1,"Cliftonian":3,"DocWatson42":1,"Cyve":1,"Panam2014":1,"ChefNathan":1},"bytesChanged":16691,"id":"Shimon Peres","wiki":"enwiki","views":254906,"score":709106.0076666668,"lang":"en","safe":true,"trendedAt":"2016-09-28T02:02:09.730Z","thumbnail":{"source":"https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Shimon_Peres_in_Brazil.jpg/82px-Shimon_Peres_in_Brazil.jpg","width":82,"height":120},"description":"Israeli politician, 8th prime minister and 9th president of Israel","lastIndex":1,"index":1,"bestIndex":1,"bias":0.4017857142857143}
);

const Liliuokalani = MockPage.fromJSON({"title":"Liliuokalani","edits":205,"anonEdits":1,"isNew":false,"notabilityFlags":0,"volatileFlags":0,"reverts":3,"start":"2016-09-26T23:37:49.317Z","updated":"2016-09-29T08:35:11.264Z","contributors":["Mark Miller","KAVEBEAR","Maile66","Kaldari"],"anons":["204.154.122.65"],"distribution":{"Mark Miller":92,"KAVEBEAR":102,"204.154.122.65":1,"Maile66":12,"Kaldari":1},"bytesChanged":20207,"id":"Liliuokalani","wiki":"enwiki","views":0,"score":6.514579096810549e-185,"lang":"en","safe":true,"lastIndex":7,"index":1,"bestIndex":1,"bias":0.4975609756097561,"thumbnail":{"source":"https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Queen_Liliuokalani.jpg/97px-Queen_Liliuokalani.jpg","width":97,"height":120},"description":"last monarch of the Kingdom of Hawaii"});


const PacificTyphoon = MockPage.fromJSON({"title":"2016 Pacific typhoon season","edits":145,"anonEdits":35,"isNew":false,"notabilityFlags":0,"volatileFlags":0,"reverts":9,"start":"2016-09-23T01:17:09.187Z","updated":"2016-09-29T14:52:38.307Z","contributors":["Meow","About123","AlphaBetaGamma01","Kaihsu","LilHelpa","Jasper Deng","CVQT","KN2731","Nino Marakot","Typhoon2013","Shubbs03","Skycycle","Jason Rees","2601:547:1102:EFAF:5582:22E2:D524:4E3C","MarioProtIV","Floatjon","Jdcomix"],"anons":["67.224.154.107","60.246.51.20","14.182.204.172","63.135.255.94","219.79.180.157","2607:FB90:82:1850:0:2:FEE2:2A01","60.246.138.64","124.104.166.192","219.79.251.73","219.79.250.237","2600:387:9:5:0:0:0:62","72.50.81.129"],"distribution":{"Meow":38,"About123":10,"AlphaBetaGamma01":3,"67.224.154.107":1,"Kaihsu":2,"LilHelpa":1,"Jasper Deng":6,"CVQT":2,"KN2731":1,"Nino Marakot":2,"60.246.51.20":1,"Typhoon2013":40,"14.182.204.172":6,"63.135.255.94":1,"219.79.180.157":3,"2607:FB90:82:1850:0:2:FEE2:2A01":3,"60.246.138.64":10,"Shubbs03":2,"Skycycle":3,"Jason Rees":1,"124.104.166.192":3,"219.79.251.73":1,"219.79.250.237":3,"2600:387:9:5:0:0:0:62":1,"72.50.81.129":2,"2601:547:1102:EFAF:5582:22E2:D524:4E3C":4,"MarioProtIV":1,"Floatjon":2,"Jdcomix":1},"bytesChanged":10039,"id":"2016 Pacific typhoon season","wiki":"enwiki","views":0,"score":0,"lang":"en","safe":true,"lastIndex":11,"index":1,"bestIndex":1,"bias":0.27586206896551724,"thumbnail":{"source":"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2016_Pacific_typhoon_season_summary.png/120px-2016_Pacific_typhoon_season_summary.png","width":120,"height":108}});

const CascadeMall = MockPage.fromJSON({"title":"2016 Cascade Mall shooting","edits":84,"anonEdits":13,"isNew":false,"notabilityFlags":0,"volatileFlags":0,"reverts":8,"start":"2016-09-25T17:58:53.171Z","updated":"2016-09-29T13:54:04.066Z","contributors":["Mapabo","General Ization","Epson Salts","Lyttle-Wight","MrX","2602:30A:2CE8:44BF:6091:9A35:D503:7B51","Jim Michael","Sally882","NotTheFakeJTP","Ansh666","G0T0","Kelisi","Ferakp","Anthon.Eff","FallingGravity","FriarTuck1981","Somedifferentstuff","Yellowdesk","EvergreenFir","Frietjes","Corn cheese","Parsley Man"],"anons":["2602:304:CFD0:6350:A975:93E1:5CF:D334","108.59.74.107","2601:3C5:8200:B79:E8FC:561:930C:D222","24.68.85.72","95.133.211.190","75.66.124.118","2001:569:705D:8700:2190:EDAA:E346:B3FB","138.75.147.110","82.22.113.75"],"distribution":{"Mapabo":2,"General Ization":12,"Epson Salts":1,"Lyttle-Wight":2,"2602:304:CFD0:6350:A975:93E1:5CF:D334":2,"MrX":2,"108.59.74.107":1,"2602:30A:2CE8:44BF:6091:9A35:D503:7B51":1,"Jim Michael":4,"Sally882":7,"2601:3C5:8200:B79:E8FC:561:930C:D222":1,"NotTheFakeJTP":1,"Ansh666":1,"24.68.85.72":1,"G0T0":15,"95.133.211.190":2,"Kelisi":1,"75.66.124.118":3,"2001:569:705D:8700:2190:EDAA:E346:B3FB":1,"Ferakp":1,"Anthon.Eff":1,"FallingGravity":2,"FriarTuck1981":1,"Somedifferentstuff":20,"138.75.147.110":1,"Yellowdesk":1,"EvergreenFir":1,"Frietjes":1,"82.22.113.75":1,"Corn cheese":1,"Parsley Man":1},"bytesChanged":4729,"id":"2016 Cascade Mall shooting","wiki":"enwiki","views":0,"score":1.981236333844914e-274,"lang":"en","safe":true,"lastIndex":22,"index":1,"bestIndex":1,"bias":0.23809523809523808,"thumbnail":{"source":"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/USA_Washington_location_map.svg/120px-USA_Washington_location_map.svg.png","width":120,"height":85}})

describe('calcScore', function() {
  it('page 1 is hotter than page 2 with half life 2', function() {
    assert.ok( calcScore( page2, 2 ) > calcScore( page, 2 ) );
  });

  it('page 1 is hotter than page 2 with half life 10', function() {
    assert.ok( calcScore( page2, 10 ) > calcScore( page, 10 ) );
  });

  it('page 3 is hotter than page 4', function() {
    assert.ok( calcScore( page3, 10 ) > calcScore( page4, 10 ) );
  });

  it('things that have visits get weighed down heavily with small half lifes', function() {
    assert.ok( calcScore( Hoboken, 24 ) > calcScore( ShimonPeres, 24 ) );
  });

  it('if things have been viewed they show up in the `by week` section', function() {
    assert.ok( calcScore( ShimonPeres, 84 ) > calcScore( Hoboken, 84 ) );
  });

  it('number of contributors weighs more heavily than number of edits', function() {
    assert.ok( calcScore( PacificTyphoon, 84 ) > calcScore( Liliuokalani, 84 ) );
  });

  it('number of contributors weighs more heavily than number of edits - even if only half the number of edits', function() {
    assert.ok( calcScore( CascadeMall, 84 ) > calcScore( PacificTyphoon, 84 ) );
  });
});

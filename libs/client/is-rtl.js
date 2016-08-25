const rtlLanguages = [
  'aeb', 'arc', 'ar', 'arz', 'azb', 'bcc', 'bgn', 'bqi', 'ckb', 'dv', 'fa', 'glk', 'he', 'khw', 'kk-cn',
  'kk-arab', 'ks-arab', 'ku-arab', 'lki', 'luz', 'lrc', 'mzn', 'pnb', 'ps', 'sd', 'sdh', 'ug-arab', 'ur', 'yi' ];

export default function ( lang ) {
  return rtlLanguages.indexOf( lang ) > -1;
}
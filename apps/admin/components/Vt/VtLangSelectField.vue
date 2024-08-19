<template>
  <div>
    <md-field>
      <label>{{ label }}</label>
      <md-select :disabled="customizable" id="form_select_lang" v-model="selectedLanguages" name="lang" @md-selected="onSelect" :multiple="multiple">
        <!-- <md-option value="Afrikaans">Afrikaans</md-option>
        <md-option value="Akan">Akan</md-option>
        <md-option value="Albanais">Albanais</md-option>
        <md-option value="Allemand">Allemand</md-option>
        <md-option value="Amharique">Amharique</md-option> -->
        <md-option value="en">Anglais</md-option>
        <!-- <md-option value="Arabe">Arabe</md-option>
        <md-option value="Arménien">Arménien</md-option>
        <md-option value="ASL">ASL</md-option>
        <md-option value="Assamais">Assamais</md-option>
        <md-option value="Assyrien">Assyrien</md-option>
        <md-option value="Azéri">Azéri</md-option>
        <md-option value="Badini">Badini</md-option>
        <md-option value="Bambara">Bambara</md-option>
        <md-option value="Bashkir">Bashkir</md-option>
        <md-option value="Basque">Basque</md-option>
        <md-option value="Bengalais">Bengalais</md-option>
        <md-option value="Biélorusse">Biélorusse</md-option>
        <md-option value="Birman">Birman</md-option>
        <md-option value="Bosniaque">Bosniaque</md-option>
        <md-option value="Bravanais">Bravanais</md-option>
        <md-option value="Bulgare">Bulgare</md-option>
        <md-option value="Cachemiri">Cachemiri</md-option>
        <md-option value="Cambodgien">Cambodgien</md-option>
        <md-option value="Cantonais">Cantonais</md-option>
        <md-option value="Catalan">Catalan</md-option>
        <md-option value="Cebuano">Cebuano</md-option>
        <md-option value="Chaldean">Chaldean</md-option>
        <md-option value="Chamorro">Chamorro</md-option>
        <md-option value="Chaozhou">Chaozhou</md-option>
        <md-option value="Chavacano">Chavacano</md-option>
        <md-option value="Chin">Chin</md-option>
        <md-option value="Chuuk">Chuuk</md-option>
        <md-option value="Cingalais">Cingalais</md-option>
        <md-option value="Cingalais">Cingalais</md-option>
        <md-option value="Coréen">Coréen</md-option>
        <md-option value="Cree">Cree</md-option>
        <md-option value="Créole">Créole</md-option>
        <md-option value="Croate">Croate</md-option>
        <md-option value="Dakota">Dakota</md-option>
        <md-option value="Danois">Danois</md-option>
        <md-option value="Dari">Dari</md-option>
        <md-option value="Dinka">Dinka</md-option>
        <md-option value="Dioula">Dioula</md-option>
        <md-option value="Dzongkha">Dzongkha</md-option>
        <md-option value="Espagnol">Espagnol</md-option>
        <md-option value="Estonien">Estonien</md-option>
        <md-option value="Ewe">Ewe</md-option>
        <md-option value="Fanti">Fanti</md-option>
        <md-option value="Farsi">Farsi</md-option>
        <md-option value="Féroïen">Féroïen</md-option>
        <md-option value="Finnois">Finnois</md-option>
        <md-option value="Flamand">Flamand</md-option> -->
        <md-option value="fr">Français</md-option>
        <!-- <md-option value="Frison">Frison</md-option>
        <md-option value="Fujian">Fujian</md-option>
        <md-option value="Fukienais">Fukienais</md-option>
        <md-option value="Fula">Fula</md-option>
        <md-option value="Fulani">Fulani</md-option>
        <md-option value="Fuzhou">Fuzhou</md-option>
        <md-option value="Ga">Ga</md-option>
        <md-option value="Gaélique">Gaélique</md-option>
        <md-option value="Galicien">Galicien</md-option>
        <md-option value="Gallois">Gallois</md-option>
        <md-option value="Ganda">Ganda</md-option>
        <md-option value="Géorgien">Géorgien</md-option>
        <md-option value="Gorani">Gorani</md-option>
        <md-option value="Grec">Grec</md-option>
        <md-option value="Guanxi">Guanxi</md-option>
        <md-option value="Gujarati">Gujarati</md-option>
        <md-option value="Hakka">Hakka</md-option>
        <md-option value="Hassanya">Hassanya</md-option>
        <md-option value="Hausa">Hausa</md-option>
        <md-option value="Hébreu">Hébreu</md-option>
        <md-option value="Hiligaïnon">Hiligaïnon</md-option>
        <md-option value="Hindi">Hindi</md-option>
        <md-option value="Hindi">Hindi</md-option>
        <md-option value="Hmong">Hmong</md-option>
        <md-option value="Hongrois">Hongrois</md-option>
        <md-option value="Ibanag">Ibanag</md-option>
        <md-option value="Igbo">Igbo</md-option>
        <md-option value="Ilocano">Ilocano</md-option>
        <md-option value="Ilonggo">Ilonggo</md-option>
        <md-option value="Indien">Indien</md-option>
        <md-option value="Indonésien">Indonésien</md-option>
        <md-option value="Inuktitut">Inuktitut</md-option>
        <md-option value="Irlandais">Irlandais</md-option>
        <md-option value="Islandais">Islandais</md-option>
        <md-option value="Italien">Italien</md-option>
        <md-option value="Jakartanais">Jakartanais</md-option>
        <md-option value="Japonais">Japonais</md-option>
        <md-option value="Javanais">Javanais</md-option>
        <md-option value="Kanjobal">Kanjobal</md-option>
        <md-option value="Kannada">Kannada</md-option>
        <md-option value="Karen">Karen</md-option>
        <md-option value="Kazakh">Kazakh</md-option>
        <md-option value="Khalkha">Khalkha</md-option>
        <md-option value="Khmer">Khmer</md-option>
        <md-option value="Kikuyu">Kikuyu</md-option>
        <md-option value="Kinyarwanda">Kinyarwanda</md-option>
        <md-option value="Kirghize">Kirghize</md-option>
        <md-option value="Kirundi">Kirundi</md-option>
        <md-option value="Kosovar">Kosovar</md-option>
        <md-option value="Kotokoli">Kotokoli</md-option>
        <md-option value="Krio">Krio</md-option>
        <md-option value="Kurde">Kurde</md-option>
        <md-option value="Kurmanji">Kurmanji</md-option>
        <md-option value="Lakota">Lakota</md-option>
        <md-option value="Laotien">Laotien</md-option>
        <md-option value="Latin">Latin</md-option>
        <md-option value="Letton">Letton</md-option>
        <md-option value="Lingala">Lingala</md-option>
        <md-option value="Lituanien">Lituanien</md-option>
        <md-option value="Luganda">Luganda</md-option>
        <md-option value="Luo">Luo</md-option>
        <md-option value="Lusoga">Lusoga</md-option>
        <md-option value="Luxembourgeois">Luxembourgeois</md-option>
        <md-option value="Maay">Maay</md-option>
        <md-option value="Macédonien">Macédonien</md-option>
        <md-option value="Malais">Malais</md-option>
        <md-option value="Malayalam">Malayalam</md-option>
        <md-option value="Maldivien">Maldivien</md-option>
        <md-option value="Malgache">Malgache</md-option>
        <md-option value="Maltais">Maltais</md-option>
        <md-option value="Mandarin">Mandarin</md-option>
        <md-option value="Mandingue">Mandingue</md-option>
        <md-option value="Mandinka">Mandinka</md-option>
        <md-option value="Maori">Maori</md-option>
        <md-option value="Marathi">Marathi</md-option>
        <md-option value="Marshallais">Marshallais</md-option>
        <md-option value="Mien">Mien</md-option>
        <md-option value="Mirpuri">Mirpuri</md-option>
        <md-option value="Mixtèque">Mixtèque</md-option>
        <md-option value="Moldave">Moldave</md-option>
        <md-option value="Mongol">Mongol</md-option>
        <md-option value="Napolitain">Napolitain</md-option>
        <md-option value="Navajo">Navajo</md-option>
        <md-option value="Néerlandais">Néerlandais</md-option>
        <md-option value="Népalais">Népalais</md-option>
        <md-option value="Norvégien">Norvégien</md-option>
        <md-option value="Nuer">Nuer</md-option>
        <md-option value="Nyanja">Nyanja</md-option>
        <md-option value="Ojibaway">Ojibaway</md-option>
        <md-option value="Oriya">Oriya</md-option>
        <md-option value="Oromo">Oromo</md-option>
        <md-option value="Ossète">Ossète</md-option>
        <md-option value="Ouïghour">Ouïghour</md-option>
        <md-option value="Ourdou">Ourdou</md-option>
        <md-option value="Ouzbek">Ouzbek</md-option>
        <md-option value="Pachtoune">Pachtoune</md-option>
        <md-option value="Pahari">Pahari</md-option>
        <md-option value="Pampangan">Pampangan</md-option>
        <md-option value="Patois">Patois</md-option>
        <md-option value="Peul">Peul</md-option>
        <md-option value="Pidgin">Pidgin</md-option>
        <md-option value="Polonais">Polonais</md-option>
        <md-option value="Portugais">Portugais</md-option>
        <md-option value="Pothwari">Pothwari</md-option>
        <md-option value="Punjabi">Punjabi</md-option>
        <md-option value="Puxian">Puxian</md-option>
        <md-option value="Quechua">Quechua</md-option>
        <md-option value="Romanche">Romanche</md-option>
        <md-option value="Romani">Romani</md-option>
        <md-option value="Roumain">Roumain</md-option>
        <md-option value="Rundi">Rundi</md-option>
        <md-option value="Russe">Russe</md-option>
        <md-option value="Samoan">Samoan</md-option>
        <md-option value="Sango">Sango</md-option>
        <md-option value="Sanskrit">Sanskrit</md-option>
        <md-option value="Serbe">Serbe</md-option>
        <md-option value="Shanghaïen">Shanghaïen</md-option>
        <md-option value="Shona">Shona</md-option>
        <md-option value="Sichuan">Sichuan</md-option>
        <md-option value="Sicilien">Sicilien</md-option>
        <md-option value="Sindhi">Sindhi</md-option>
        <md-option value="Siswati">Siswati</md-option>
        <md-option value="Slovaque">Slovaque</md-option>
        <md-option value="Slovène">Slovène</md-option>
        <md-option value="Slovène">Slovène</md-option>
        <md-option value="Somalien">Somalien</md-option>
        <md-option value="Soninké">Soninké</md-option>
        <md-option value="Sorani">Sorani</md-option>
        <md-option value="Sotho">Sotho</md-option>
        <md-option value="Soundanais">Soundanais</md-option>
        <md-option value="Suédois">Suédois</md-option>
        <md-option value="Susu">Susu</md-option>
        <md-option value="Swahili">Swahili</md-option>
        <md-option value="Sylheti">Sylheti</md-option>
        <md-option value="Tadjik">Tadjik</md-option>
        <md-option value="Tagalog">Tagalog</md-option>
        <md-option value="Taïwanais">Taïwanais</md-option>
        <md-option value="Tamoul">Tamoul</md-option>
        <md-option value="Tchèque">Tchèque</md-option>
        <md-option value="Telugu">Telugu</md-option>
        <md-option value="Thaï">Thaï</md-option>
        <md-option value="Tibétain">Tibétain</md-option>
        <md-option value="Tigrinya">Tigrinya</md-option>
        <md-option value="Tongan">Tongan</md-option>
        <md-option value="Tshiluba">Tshiluba</md-option>
        <md-option value="Tsonga">Tsonga</md-option>
        <md-option value="Tswana">Tswana</md-option>
        <md-option value="Turc">Turc</md-option>
        <md-option value="Turkmène">Turkmène</md-option>
        <md-option value="Ukrainien">Ukrainien</md-option>
        <md-option value="Venda">Venda</md-option>
        <md-option value="Vietnamien">Vietnamien</md-option>
        <md-option value="Visayan">Visayan</md-option>
        <md-option value="Wolof">Wolof</md-option>
        <md-option value="Xhosa">Xhosa</md-option>
        <md-option value="Yao">Yao</md-option>
        <md-option value="Yiddish">Yiddish</md-option>
        <md-option value="Yoruba">Yoruba</md-option>
        <md-option value="Yupik">Yupik</md-option>
        <md-option value="Zoulou">Zoulou</md-option> -->
      </md-select>
    </md-field>
    <md-checkbox v-model="customizable">Langue personnalisables</md-checkbox>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Langue'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default(){
        return []
      }
    }
  },
  data() {
    return {
      customizable: false,
      selectedLanguages: this.value,
      languages: [
        'Afrikaans',
        'Akan',
        'Albanais',
        'Allemand',
        'Amharique',
        'Anglais',
        'Arabe',
        'Arménien',
        'ASL (langue des signes américaine)',
        'Assamais',
        'Assyrien',
        'Azéri',
        'Badini',
        'Bambara',
        'Bashkir',
        'Basque',
        'Bengalais',
        'Biélorusse',
        'Birman',
        'Bosniaque',
        'Bravanais',
        'Bulgare',
        'Cachemiri',
        'Cambodgien',
        'Cantonais',
        'Catalan',
        'Cebuano',
        'Chaldean',
        'Chamorro',
        'Chaozhou',
        'Chavacano',
        'Chin',
        'Chuuk',
        'Cingalais',
        'Cingalais',
        'Coréen',
        'Cree',
        'Créole haïtien',
        'Croate',
        'Dakota',
        'Danois',
        'Dari',
        'Dinka',
        'Dioula',
        'Dzongkha',
        'Espagnol',
        'Estonien',
        'Ewe',
        'Fanti',
        'Farsi',
        'Féroïen',
        'Finnois',
        'Flamand',
        'Français',
        'Français canadien',
        'Frison',
        'Fujian',
        'Fukienais',
        'Fula',
        'Fulani',
        'Fuzhou',
        'Ga',
        'Gaélique',
        'Galicien',
        'Gallois',
        'Ganda',
        'Géorgien',
        'Gorani',
        'Grec',
        'Guanxi',
        'Gujarati',
        'Hakka',
        'Hassanya',
        'Hausa',
        'Hébreu',
        'Hiligaïnon',
        'Hindi',
        'Hindi fidjien',
        'Hmong',
        'Hongrois',
        'Ibanag',
        'Igbo',
        'Ilocano',
        'Ilonggo',
        'Indien',
        'Indonésien',
        'Inuktitut',
        'Irlandais',
        'Islandais',
        'Italien',
        'Jakartanais',
        'Japonais',
        'Javanais',
        'Kanjobal',
        'Kannada',
        'Karen',
        'Kazakh',
        'Khalkha',
        'Khmer',
        'Kikuyu',
        'Kinyarwanda',
        'Kirghize',
        'Kirundi',
        'Kosovar',
        'Kotokoli',
        'Krio',
        'Kurde',
        'Kurmanji',
        'Lakota',
        'Laotien',
        'Latin',
        'Letton',
        'Lingala',
        'Lituanien',
        'Luganda',
        'Luo',
        'Lusoga',
        'Luxembourgeois',
        'Maay',
        'Macédonien',
        'Malais',
        'Malayalam',
        'Maldivien',
        'Malgache',
        'Maltais',
        'Mandarin',
        'Mandingue',
        'Mandinka',
        'Maori',
        'Marathi',
        'Marshallais',
        'Mien',
        'Mirpuri',
        'Mixtèque',
        'Moldave',
        'Mongol',
        'Napolitain',
        'Navajo',
        'Néerlandais',
        'Népalais',
        'Norvégien',
        'Nuer',
        'Nyanja',
        'Ojibaway',
        'Oriya',
        'Oromo',
        'Ossète',
        'Ouïghour',
        'Ourdou',
        'Ouzbek',
        'Pachtoune',
        'Pahari',
        'Pampangan',
        'Patois',
        'Peul',
        'Pidgin anglais',
        'Polonais',
        'Portugais',
        'Pothwari',
        'Punjabi',
        'Puxian',
        'Quechua',
        'Romanche',
        'Romani',
        'Roumain',
        'Rundi',
        'Russe',
        'Samoan',
        'Sango',
        'Sanskrit',
        'Serbe',
        'Shanghaïen',
        'Shona',
        'Sichuan',
        'Sicilien',
        'Sindhi',
        'Siswati/Swati',
        'Slovaque',
        'Slovène',
        'Slovène',
        'Somalien',
        'Soninké',
        'Sorani',
        'Sotho',
        'Soundanais',
        'Suédois',
        'Susu',
        'Swahili',
        'Sylheti',
        'Tadjik',
        'Tagalog',
        'Taïwanais',
        'Tamoul',
        'Tchèque',
        'Telugu',
        'Thaï',
        'Tibétain',
        'Tigrinya',
        'Tongan',
        'Tshiluba',
        'Tsonga',
        'Tswana',
        'Turc',
        'Turkmène',
        'Ukrainien',
        'Venda',
        'Vietnamien',
        'Visayan',
        'Wolof',
        'Xhosa',
        'Yao',
        'Yiddish',
        'Yoruba',
        'Yupik',
        'Zoulou'
      ]
    }
  },
  methods: {
    onSelect () {
      this.$emit('on-select', {value: this.selectedLanguages, customizable: this.customizable})
    }
  },
  watch: {
    customizable () {
      this.selectedLanguages = []
    }
  }
}
</script>

<style>

</style>

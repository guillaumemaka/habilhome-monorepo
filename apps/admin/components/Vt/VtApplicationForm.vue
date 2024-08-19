<template>
  <div class="md-layout">
    <div class="md-layout-item md-medium-size-100">
      <md-card>
        <md-content class="pa-4">
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-size-15">
              <div class="md-layout">
                <div class="md-layout-item">
                  <div class="md-layout md-alignment-top-center">
                    <img class="md-layout-item app_image" :src="(imageUrl && fields && fields.imageUrl && fields.imageUrl.valid) ? imageUrl : '/img/app_img_placeholder.svg'" alt="">
                    <md-switch class="md-layout-item" v-model="application.draft">{{label}}</md-switch>
                    <md-button v-if="application.deletedAt" @click="onRestore" class="md-rose md-layout-item md-size-100">
                      Restaurer
                    </md-button>
                    <md-button @click="application.favorite = !application.favorite" :class="[{
                        'md-rose': favorite
                      }, 'md-layout-item md-size-5 md-round md-just-icon']">
                      <md-icon>{{application.favorite ? 'favorite' : 'favorite_border'}}</md-icon>
                    </md-button>
                  </div>
                </div>
              </div>
            </div>
            <div class="md-layout-item md-size-85">
              <section class="md-card-tabs">
                <md-list class="flex-column">
                  <md-list-item :class="{'active md-rose': currentLang === 'en'}" @click.prevent="setLang('en')">Anglais</md-list-item>
                  <md-list-item :class="{'active md-rose': currentLang === 'fr'}" @click.prevent="setLang('fr')">Français</md-list-item>
                </md-list>
              </section>
              <section>
                <form @submit.prevent="onSubmit">
                  <h2 class="text-rose">Habitudes de Vie (Tags)</h2>
                  <hr/>
                  <vt-theme-input-field class="mt-3" :selected-themes="current.subThemes" :lang="currentLang" @on-theme-selected="onThemeSelected" @on-theme-removed="onThemeRemoved" />

                  <h2 class="text-rose">Informations générales</h2>
                  <hr/>
                  <md-field :class="[errorClass('name'), 'my-4']">
                    <label>Nom de l'application</label>
                    <md-input class="large-text" v-validate="'required'" data-vv-as="Nom de l'application" name="name" type="text" v-model="current.name"></md-input>
                    <span class="md-error">{{errors.first('name')}}</span>
                  </md-field>

                  <md-field class="my-4">
                    <label>Nom de la compagnie</label>
                    <md-input name="companyName" type="text" v-model="current.companyName"></md-input>
                  </md-field>

                  <!-- <vt-lang-select-field :value="lang" @on-select="onLanguageSelected" label="Langue de l'application" multiple /> -->
                  <div class="p-9 my-4">
                    <md-field>
                      <label>Langue</label>
                      <md-select id="form_select_lang" v-model="application.lang" name="lang" multiple>
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
                    <md-checkbox v-model="application.customizableLang">Peut facilement être utilisé en français ou en anglais</md-checkbox>
                  </div>

                  <md-field :class="[errorClass('imageUrl'), 'my-4']">
                    <label>Image URL</label>
                    <md-input v-validate="{url: {require_protocol: true }}" data-vv-as="Image URL" name="imageUrl" type="url" v-model="application.imageUrl" />
                    <!-- <md-icon v-if="imageUrl && imageUrl !== ''" :class="[{
                        'md-success': fields.imageUrl && (fields.imageUrl.valid || online),
                        'md-invalid': fields.imageUrl && (fields.imageUrl.invalid || !online)
                      }]">{{ imageUrlIcon }}</md-icon> -->
                    <span class="md-error">{{errors.first('imageUrl')}}</span>
                  </md-field>

                  <md-field class="my-4">
                    <label>Description</label>
                    <md-textarea md-autogrow name="description" v-model="current.description"></md-textarea>
                  </md-field>

                  <!-- <md-field class="my-4">
                    <label>Système d'exploitation</label>
                    <md-textarea md-autogrow name="os" v-model="current.os"></md-textarea>
                  </md-field> -->

                  <div class="my-4">
                    <label class="pb-2">Capacités Requises</label>
                    <editor :init="init" :plugins="plugins" :toolbar="toolbar" class="pt-4 w-100" v-model="current.requiredAbilities" />
                  </div>

                  <div :class="[{
                    'mb-5': fields.priceLow && fields.priceLow.invalid || fields.priceHigh && fields.priceHigh.invalid
                  }, 'md-layout md-alignment-center-center']">
                    <div class="md-layout-item pl-0">
                      <md-field :class="errorClass('priceLow')">
                        <label>Prix minimum</label>
                        <md-input type="text" :disabled="application.price.free" v-model="application.price.low"></md-input>
                        <span class="md-suffix">{{application.price.currency}}</span>
                        <span class="md-error">{{errors.first('priceLow')}}</span>
                      </md-field>
                    </div>
                    <div class="md-layout-item">
                      <md-field :class="errorClass('priceHigh')">
                        <label>Prix maximum</label>
                        <md-input type="text" :disabled="application.price.fixedPrice || application.price.free" name="priceHigh" v-model="application.price.high"></md-input>
                        <span class="md-suffix">{{application.price.currency}}</span>
                        <span class="md-error">{{errors.first('priceHigh')}}</span>
                      </md-field>
                    </div>
                    <div class="md-layout-item">
                      <md-field>
                        <label>Devise</label>
                        <md-select :disabled="application.price.free" name="currency" v-model="application.price.currency">
                          <md-option value="USD" selected="selected">United States Dollars</md-option>
                          <md-option value="EUR">Euro</md-option>
                          <!-- <md-option value="GBP">United Kingdom Pounds</md-option>
                          <md-option value="DZD">Algeria Dinars</md-option>
                          <md-option value="ARP">Argentina Pesos</md-option>
                          <md-option value="AUD">Australia Dollars</md-option>
                          <md-option value="ATS">Austria Schillings</md-option>
                          <md-option value="BSD">Bahamas Dollars</md-option>
                          <md-option value="BBD">Barbados Dollars</md-option>
                          <md-option value="BEF">Belgium Francs</md-option>
                          <md-option value="BMD">Bermuda Dollars</md-option>
                          <md-option value="BRR">Brazil Real</md-option>
                          <md-option value="BGL">Bulgaria Lev</md-option> -->
                          <md-option value="CAD">Canada Dollars</md-option>
                          <!-- <md-option value="CLP">Chile Pesos</md-option>
                          <md-option value="CNY">China Yuan Renmimbi</md-option>
                          <md-option value="CYP">Cyprus Pounds</md-option>
                          <md-option value="CSK">Czech Republic Koruna</md-option>
                          <md-option value="DKK">Denmark Kroner</md-option>
                          <md-option value="NLG">Dutch Guilders</md-option>
                          <md-option value="XCD">Eastern Caribbean Dollars</md-option>
                          <md-option value="EGP">Egypt Pounds</md-option>
                          <md-option value="FJD">Fiji Dollars</md-option>
                          <md-option value="FIM">Finland Markka</md-option>
                          <md-option value="FRF">France Francs</md-option>
                          <md-option value="DEM">Germany Deutsche Marks</md-option>
                          <md-option value="XAU">Gold Ounces</md-option>
                          <md-option value="GRD">Greece Drachmas</md-option>
                          <md-option value="HKD">Hong Kong Dollars</md-option>
                          <md-option value="HUF">Hungary Forint</md-option>
                          <md-option value="ISK">Iceland Krona</md-option>
                          <md-option value="INR">India Rupees</md-option>
                          <md-option value="IDR">Indonesia Rupiah</md-option>
                          <md-option value="IEP">Ireland Punt</md-option>
                          <md-option value="ILS">Israel New Shekels</md-option>
                          <md-option value="ITL">Italy Lira</md-option>
                          <md-option value="JMD">Jamaica Dollars</md-option>
                          <md-option value="JPY">Japan Yen</md-option>
                          <md-option value="JOD">Jordan Dinar</md-option>
                          <md-option value="KRW">Korea (South) Won</md-option>
                          <md-option value="LBP">Lebanon Pounds</md-option>
                          <md-option value="LUF">Luxembourg Francs</md-option>
                          <md-option value="MYR">Malaysia Ringgit</md-option>
                          <md-option value="MXP">Mexico Pesos</md-option>
                          <md-option value="NLG">Netherlands Guilders</md-option>
                          <md-option value="NZD">New Zealand Dollars</md-option>
                          <md-option value="NOK">Norway Kroner</md-option>
                          <md-option value="PKR">Pakistan Rupees</md-option>
                          <md-option value="XPD">Palladium Ounces</md-option>
                          <md-option value="PHP">Philippines Pesos</md-option>
                          <md-option value="XPT">Platinum Ounces</md-option>
                          <md-option value="PLZ">Poland Zloty</md-option>
                          <md-option value="PTE">Portugal Escudo</md-option>
                          <md-option value="ROL">Romania Leu</md-option>
                          <md-option value="RUR">Russia Rubles</md-option>
                          <md-option value="SAR">Saudi Arabia Riyal</md-option>
                          <md-option value="XAG">Silver Ounces</md-option>
                          <md-option value="SGD">Singapore Dollars</md-option>
                          <md-option value="SKK">Slovakia Koruna</md-option>
                          <md-option value="ZAR">South Africa Rand</md-option>
                          <md-option value="KRW">South Korea Won</md-option>
                          <md-option value="ESP">Spain Pesetas</md-option>
                          <md-option value="XDR">Special Drawing Right (IMF)</md-option>
                          <md-option value="SDD">Sudan Dinar</md-option>
                          <md-option value="SEK">Sweden Krona</md-option>
                          <md-option value="CHF">Switzerland Francs</md-option>
                          <md-option value="TWD">Taiwan Dollars</md-option>
                          <md-option value="THB">Thailand Baht</md-option>
                          <md-option value="TTD">Trinidad and Tobago Dollars</md-option>
                          <md-option value="TRL">Turkey Lira</md-option>
                          <md-option value="VEB">Venezuela Bolivar</md-option>
                          <md-option value="ZMK">Zambia Kwacha</md-option>
                          <md-option value="EUR">Euro</md-option>
                          <md-option value="XCD">Eastern Caribbean Dollars</md-option>
                          <md-option value="XDR">Special Drawing Right (IMF)</md-option>
                          <md-option value="XAG">Silver Ounces</md-option>
                          <md-option value="XAU">Gold Ounces</md-option>
                          <md-option value="XPD">Palladium Ounces</md-option>
                          <md-option value="XPT">Platinum Ounces</md-option> -->
                        </md-select>
                      </md-field>
                    </div>
                  </div>
                  <md-checkbox class="px-2" :disabled="application.price.variable || application.price.free" v-model="application.price.fixedPrice">Prix fixe</md-checkbox>
                  <md-checkbox class="px-2" :disabled="application.price.fixedPrice || application.price.free" v-model="application.price.variable">Variable</md-checkbox>
                  <md-checkbox class="px-2" :disabled="application.price.variable || application.price.fixedPrice" v-model="application.price.free">Gratuit</md-checkbox>
                  <md-checkbox class="px-2" v-model="application.price.inAppPurchased">Contient des achats intègrés</md-checkbox>

                  <h2 class="text-rose mb-2 mt-4">Commentaire et précision</h2>
                  <hr class="mb-4" />
                  <md-field>
                    <label>Précision</label>
                    <md-textarea placeholder="Commentaire et précision" md-autogrow name="comment" v-model="current.comment"></md-textarea>
                  </md-field>

                  <h2 class="text-rose mb-2 mt-4">
                    <span>Liens complémentaires</span>
                    <md-button class="right md-rose md-just-icon md-round" @click="addLink()">
                      <md-icon size-3x>add</md-icon>
                    </md-button>
                  </h2>
                  <hr/>
                  <md-empty-state v-if="!current.links.length" md-icon="link" md-label="Ajouter un lien" md-description="Ajoutez tous liens ayant un rapport avec cete application ex: site web, support, service client...">
                    <md-button @click="addLink" class="md-primary md-raised">Ajouter un lien</md-button>
                  </md-empty-state>

                  <div class="mb-3" :key="`link_${index}`" v-for="(item, index) in current.links">
                    <md-field :class="[errorClass('title', `link_${index}`), '']">
                      <label>Titre/Libéllé</label>
                      <md-input v-validate="'required'" v-model="item.title" name="title" data-vv-as="Titre/Libéllé" :data-vv-scope="`link_${index}`"></md-input>
                      <span class="md-error" v-show="errors.has('title', `link_${index}`)">{{ errors.first('title', `link_${index}`) }}</span>
                    </md-field>
                    <md-field :class="[errorClass('href', `link_${index}`), '']">
                      <label>Url (Optionnel)</label>
                      <md-input v-validate="{required: false, url: {require_protocol: true }}" data-vv-as="Url" v-model="item.url" name="href" :data-vv-scope="`link_${index}`"></md-input>
                      <md-button class="md-just-icon md-simple" @click="deleteLink(index)">
                        <md-icon>delete</md-icon>
                      </md-button>
                      <span v-show="errors.has('href', `link_${index}`)" class="md-error">{{errors.first('href', `link_${index}`)}}</span>
                    </md-field>
                  </div>

                  <md-button class="pull-left md-round md-danger" @click="$router.go(-1)">
                    <md-icon>chevron_left</md-icon> Retour</md-button>
                  <md-button :disabled="!isFormValid" class="pull-right md-round md-rose" @click="onSave">
                    <md-icon>done</md-icon> Enregistrer</md-button>
                </form>
              </section>
            </div>
          </div>
        </md-content>
      </md-card>
    </div>
  </div>
</template>

<script>
import { baseMixin, formMixin } from '@/components/Vt/applicationMixins'
import VtThemeInputField from '@/components/Vt/VtThemeInputField.vue'
import { validationMixin } from '@/components/Vt/validationMixins'
import Editor from '@tinymce/tinymce-vue'

export default {
  data() {
    return {
      selectedThemes: [],
      plugins: ['lists', 'directionality'],
      toolbar: [
        'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | fontsizeselect'
      ],
      init: {
        skin_url: '/tinymce/ui/oxide'
      }
    }
  },
  components: {
    VtThemeInputField,
    Editor
  },
  mixins: [baseMixin, formMixin, validationMixin],
  computed: {
    priceLowValidations() {
      return 'numeric|decimal:2'
    },
    priceHighValidations() {
      if (this.application.price.variable) {
        return 'numeric|decimal:2'
      }

      return ''
    },
    themes() {
      return this.selectedThemes.reduce(
        (prev, curr) => {
          const theme = curr[this.currentLang].parent
          const subTheme = curr[this.currentLang].name

          if (!prev[this.currentLang].themes.includes(theme)) {
            prev[this.currentLang].themes.push(theme)
          }

          if (!prev[this.currentLang].subThemes.includes(subTheme)) {
            prev[this.currentLang].subThemes.push(subTheme)
          }

          return prev
        },
        {
          en: { themes: [], subThemes: [] },
          fr: { themes: [], subThemes: [] }
        }
      )
    }
  },
  methods: {
    onLanguageSelected({ value, customizable }) {
      this.lang = value
      this.application.customizableLang = customizable
    },
    onThemeSelected(theme) {
      this.application.fr.subThemes.push(theme.fr.subTheme)
      this.application.en.subThemes.push(theme.en.subTheme)
      // for (let key in Object.keys(theme)){
      //   if(this.application[key] !== undefined && theme[key] !== undefined){
      //       this.application[key].subThemes.push(theme[key].subTheme)
      //   }
      // }
      // this.current.themes.push(theme.name)
      // this.selectedThemes.push(theme)
      // this.application[this.currentLang].themes.push(
      //   theme[this.currentLang].parent
      // )
      // this.application[this.currentLang].subThemes.push(
      //   theme[this.currentLang].name
      // )
      // this.application.en.themes.push(theme.en.parent)
      // this.application.en.subThemes.push(theme.en.name)
    },
    onThemeRemoved(text, index) {
      this.application.fr.subThemes.splice(index, 1)
      this.application.en.subThemes.splice(index, 1)
      // this.current.subThemes = this.current.subThemes.filter(
      //   t => t !== text
      // )

      // const themes = this.selectedThemes
      //   .filter(t => t.subThemes === text)
      //   .map(t => t.name)

      // this.current.themes = difference(this.current.themes, themes)

      // this.selectedThemes = this.selectedThemes.filter(t => !themes.includes(t.name))
    }
  },
  watch: {
    'application.price.free': function() {
      this.application.price.high = null
      this.application.price.low = null
      this.$validator.reset()
    },
    'application.price.fixedPrice': function() {
      this.application.price.high = null
      this.$validator.reset()
    },
    'application.price.variable': function() {
      if (!this.application.price.high) {
        this.application.price.high = null
      }

      if (!this.application.price.low) {
        this.application.price.low = null
      }
      this.$validator.reset()
    },
    'application.price.inAppPurchased': function() {
      this.$validator.reset()
    }
  }
}
</script>

<style lang="scss" scoped>
// @import '~/assets/scss/app.scss';

.app_image {
  width: 150px;
  height: 150px;
}
.flex-column {
  flex-flow: row-reverse;
}

// form {
//   .md-field ~ h2,
//   .md-checkbox ~ h2 {
//     margin-top: 1em;
//   }

//   .md-checkbox ~ .md-field {
//     margin: 0;
//     padding: 0;
//   }

//   hr + .md-field,
//   hr + .md-checkbox {
//     margin-bottom: 1em;
//   }
// }
</style>

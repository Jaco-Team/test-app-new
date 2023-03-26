import React, { useEffect } from 'react';

import dynamic from 'next/dynamic'

const DynamicHeader = dynamic(() => import('../../components/header.js'))
const DynamicFooter = dynamic(() => import('../../components/footer.js'))
const DynamicHomePage = dynamic(() => import('../../modules/home/page.js'))

import { roboto } from '../../ui/Font.js'
import { api } from '../../components/api.js';

import { useHomeStore, useCitiesStore } from '../../components/store.js';

const this_module = 'home';

export default function Home(props) {

  const { city, cats, cities, page } = props.data1;

  const [ getBanners, getItemsCat ] = useHomeStore( state => [ state.getBanners, state.getItemsCat ] );
  const [ thisCity, setThisCity, setThisCityRu, setThisCityList ] = 
    useCitiesStore(state => [ state.thisCity, state.setThisCity, state.setThisCityRu, state.setThisCityList ]);

  useEffect(() => {
    if( thisCity != city ){
      setThisCity(city);
      setThisCityRu( cities.find( item => item.link == city )['name'] );
      setThisCityList(cities)
    }

    getBanners(this_module, city);
    getItemsCat(this_module, city);
  }, []);

  return (
    <div className={roboto.variable}>
      <DynamicHeader city={city} cats={cats} city_list={cities} active_page={this_module} />

      <DynamicHomePage page={page} city={city} />
      
      <DynamicFooter cityName={city} />
    </div>
  )
}

/*
class Akcii_old extends React.Component {
  constructor(props) {
      super(props);
      
      this.state = {    
          is_load: false,
          
          page: this.props.data1 ? this.props.data1.page : null,
          title: this.props.data1 ? this.props.data1.page.title : '',
          description: this.props.data1 ? this.props.data1.page.description : '',

          city: this.props.data1 ? this.props.data1.city : '',
          city_name: this.props.city,
          cats: this.props.data1?.cats ?? [],
          city_list: this.props.data1?.cities ?? [],

          openMSG: false,
          statusMSG: false,
          textMSG: '',

          banners: []
      };
  }
  
  getData = (method, data = {}) => {
    data.type = method; 

    return fetch(config.urlApi+this_module, {
      method: 'POST',
      headers: {
          'Content-Type':'application/x-www-form-urlencoded'},
      body: queryString.stringify(data)
    })
      .then((res) => res.json())
      .then((json) => {
        return json;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidMount(){
    this.getBanners()
  }
  
  closeAlert(){

  }

  async getBanners(){
    let data = {
      city_id: this.state.city
    };

    const json = await this.getData('get_banners', data);

    console.log( 'banners', json )

    this.setState({
      banners: json.banners
    })
  }
  
  render() {
    return (
      <div className={roboto.variable}>
        <Header city={this.state.city} cats={this.state.cats} city_list={this.state.city_list} active_page={this_module} />

        { this.state.banners.length == 0 ? null : 
          <Banners banners={this.state.banners} />
        }

        <Grid container spacing={3} className="Actii mainContainer">
                  
          <Head>
            <title>{this.state.title}</title>
            <meta name="description" content={this.state.description} />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          
          <Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            open={this.state.openMSG}
            autoHideDuration={3000}
            onClose={this.closeAlert.bind(this)}
            message={this.state.textMSG}
            style={{ backgroundColor: this.state.statusMSG ? 'green' : '#BB0025', borderRadius: 4 }}
          />

          <Grid item xs={12}>
            <Grid container spacing={3}>

            

            </Grid>
          </Grid>

          

        </Grid>

        { this.state.city == '' ? null :
          <Footer cityName={this.state.city} />
        }
      </div>
    )
  }
}*/

export async function getServerSideProps({ req, res, query }) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=86400'
  )

  let data = {
    type: 'get_page_info', 
    city_id: query.city,
    page: '' 
  };

  const data1 = await api(this_module, data);

  data1['city'] = query.city;

  return { props: { data1 } }
}

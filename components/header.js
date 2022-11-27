import * as React from 'react';
import AppBar from '@mui/material/AppBar';
//import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

import Link from 'next/link'
import Image from 'next/image';

import JacoLogo from '../public/jaco-logo.png'

import { ModalCity } from './cityForm.js'
import { ModalLogin } from './loginForm.js'

import { roboto } from './elements.js'

export class Header extends React.Component{
    is_load = false;

    constructor(props) {
        super(props);
        
        console.log( this.props )

        if( this.props && this.props.data ){
            this.is_load = true;

            /*itemsStore.setDops(this.props.data.all.other.cats.need_dop);
            itemsStore.setAllItems(this.props.data.all.other.cats.all_items);
            itemsStore.setAllItemsCat(this.props.data.all.other.cats.arr);
            itemsStore.setAllItemsCatNew(this.props.data.all.other.cats.main_cat);
            itemsStore.setFreeItems(this.props.data.all.other.cats.free_items);
            itemsStore.setBanners(this.props.data.all.other.cats.baners)
            itemsStore.setCityRU(this.props.data.all.other.cats.this_city_name_ru);
            itemsStore.setCity(this.props.city)*/
        }
        
        this.state = {      
            this_link: this.props.this_link ? this.props.this_link : '',
            categoryItemsNew: this.props.data ? this.props.data.all.other.cats.main_cat : [],
            
            categoryItems: this.props.data ? this.props.data.all.other.cats.arr : [],
            cartItems: [],
            activePage: '',
            is_load: false,
            is_load_new: false,
            openCity: false,
            cityName: this.props.city ? this.props.city : '',
            testData: [1, 2, 3, 4],
            cityList: this.props.data ? this.props.data.all.other.cats.city_list : [{ link: 'samara', name: 'Самара' }, { link: 'togliatty', name: 'Тольятти' }],
            
            openLoginNew: false,
            
            userName: '',
            token: '',
            
            soc_link: null,
            openDrawer: false,
            anchorEl: null,
            cityNameRu: this.props.data ? this.props.data.all.other.cats.this_city_name_ru && this.props.data.all.other.cats.this_city_name_ru.length > 0 ? this.props.data.all.other.cats.this_city_name_ru : 'Город' : 'Город',



            city: this.props.city
        };
    }

    openCity(){
        this.setState({
            openCity: true
        })
    }
    
    closeCity(){
        this.setState({
            openCity: false
        })
    }

    openLogin(){
        if( localStorage.getItem('token') && localStorage.getItem('token').length > 0 ){
            fetch(config.urlApi, {
                method: 'POST',
                headers: {
                    'Content-Type':'application/x-www-form-urlencoded'},
                body: queryString.stringify({
                    type: 'get_user_data', 
                    user_id: localStorage.getItem('token')
                })
            }).then(res => res.json()).then(json => {
                //itemsStore.setToken( localStorage.getItem('token'), json ); 
                //itemsStore.setUserName(json);

                this.is_load = false;

                this.setState({
                    userName: json,
                    token: localStorage.getItem('token')
                })

                if (typeof window !== 'undefined') {
                    window.location.pathname = '/'+this.state.cityName+'/profile';
                }
            })
            .catch(err => { });
        }else{
            this.setState({
                openLoginNew: true
            })
        }
    }
    
    closeLogin(){
        this.setState({
            openLoginNew: false,
        })
    }

    render(){
        return (
            <div className={roboto.variable}>
                <AppBar position="fixed" className='headerNew' id='headerNew' elevation={2} sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Toolbar>
                        <div style={{ width: '4.51%' }} />
                        <Link href={"/"+this.state.city} style={{ width: '14.8%' }}>
                            <Image alt="Жако доставка роллов и пиццы" src={JacoLogo} width={200} height={50} priority={true} />
                        </Link> 
                        <div style={{ width: '2.53%' }} />

                        <a style={{ width: '7.22%', minWidth: 'max-content', textDecoration: 'none' }} onClick={this.openCity.bind(this)}>
                            <span className={'headerCat'}>Город</span>
                        </a>
                        <div style={{ width: '0.36%' }} />

                        <React.Fragment>
                            <Link href={"/"} style={{ width: '7.22%', minWidth: 'max-content', textDecoration: 'none' }}>
                                <span className={'headerCat'}>Роллы</span>
                            </Link> 
                            <div style={{ width: '0.36%' }} />
                        </React.Fragment>
                        <React.Fragment>
                            <Link href={"/"} style={{ width: '7.22%', minWidth: 'max-content', textDecoration: 'none' }}>
                                <span className={'headerCat'}>Пицца</span>
                            </Link> 
                            <div style={{ width: '0.36%' }} />
                        </React.Fragment>
                        <React.Fragment>
                            <Link href={"/"} style={{ width: '7.22%', minWidth: 'max-content', textDecoration: 'none' }}>
                                <span className={'headerCat'}>Закуски</span>
                            </Link> 
                            <div style={{ width: '0.36%' }} />
                        </React.Fragment>
                        <React.Fragment>
                            <Link href={"/"} style={{ width: '7.22%', minWidth: 'max-content', textDecoration: 'none' }}>
                                <span className={'headerCat'}>Паста</span>
                            </Link> 
                            <div style={{ width: '0.36%' }} />
                        </React.Fragment>
                        <React.Fragment>
                            <Link href={"/"} style={{ width: '7.22%', minWidth: 'max-content', textDecoration: 'none' }}>
                                <span className={'headerCat'}>Напитки</span>
                            </Link> 
                            <div style={{ width: '0.36%' }} />
                        </React.Fragment>
                        <React.Fragment>
                            <Link href={"/"} style={{ width: '7.22%', minWidth: 'max-content', textDecoration: 'none' }}>
                                <span className={'headerCat'}>Соусы</span>
                            </Link> 
                            <div style={{ width: '0.36%' }} />
                        </React.Fragment>
                                            

                        <Link href={"/"+this.state.city+"/akcii"} style={{ width: '7.22%', minWidth: 'max-content', textDecoration: 'none' }}>
                            <span className={'headerCat'}>Акции</span>
                        </Link>
                        <div style={{ width: '0.36%' }} />

                        
                        <Link href={"/"} style={{ width: '7.22%', minWidth: 'max-content', textDecoration: 'none' }} onClick={this.openLogin.bind(this)}><span className={'headerCat'}>Профиль</span></Link>
                                

                        <div style={{ width: '3.25%' }} />

                        <div style={{ width: '4.51%' }} />
                        
                    </Toolbar>
                </AppBar>

                { !this.is_load ? null :
                    <>
                        <ModalCity isOpen={this.state.openCity} close={this.closeCity.bind(this)} cityList={this.state.cityList} cityName={this.state.cityName} />
                        <ModalLogin isOpen={this.state.openLoginNew} close={this.closeLogin.bind(this)} />
                    </>
                }
            </div>
        )
    }
}
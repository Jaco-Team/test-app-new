import React from 'react';

import Grid from '@mui/material/Grid';
import { Link as ScrollLink } from "react-scroll";

export default function AboutBreadcrumbs() {

  return (
    <Grid item className="DocsBreadcrumbs" style={{ paddingBottom: 15 }}>
      <div>
        <span>О Компании</span>
        <ul>
          <li><ScrollLink to={"tag1"} activeClass="active" spy={true} smooth={true} offset={-65}>Превосходные блюда</ScrollLink></li>
          <li><ScrollLink to={"tag2"} activeClass="active" spy={true} smooth={true} offset={-65}>Доступные цены</ScrollLink></li>
          <li><ScrollLink to={"tag3"} activeClass="active" spy={true} smooth={true} offset={-65}>Как выглядит кафе</ScrollLink></li>
          <li><ScrollLink to={"tag4"} activeClass="active" spy={true} smooth={true} offset={-65}>Время приготовления заказа</ScrollLink></li>
          <li><ScrollLink to={"tag5"} activeClass="active" spy={true} smooth={true} offset={-65}>Заряжаем оптимизмом!</ScrollLink></li>
          <li><ScrollLink to={"tag6"} activeClass="active" spy={true} smooth={true} offset={-65}>Социальная и экологическая ответственность</ScrollLink></li>
          <li><ScrollLink to={"tag7"} activeClass="active" spy={true} smooth={true} offset={-65}>Обратная связь</ScrollLink></li>
          <li><ScrollLink to={"tag8"} activeClass="active" spy={true} smooth={true} offset={-65}>Сотрудничество</ScrollLink></li>
        </ul>
      </div>
    </Grid>
  )
}

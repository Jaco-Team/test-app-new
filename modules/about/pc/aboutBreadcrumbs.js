import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { Link as ScrollLink } from 'react-scroll';
import { observeScrollSections } from '@/utils/sectionScrollSpy';

const SECTIONS = [
  ['tag1', 'Превосходные блюда'],
  ['tag2', 'Доступные цены'],
  ['tag3', 'Как выглядит кафе'],
  ['tag4', 'Время приготовления заказа'],
  ['tag5', 'Заряжаем оптимизмом!'],
  ['tag6', 'Социальная и экологическая ответственность'],
  ['tag7', 'Обратная связь'],
  ['tag8', 'Сотрудничество'],
];

export default function AboutBreadcrumbs() {
  const [active, setActive] = useState('tag1');
  useEffect(() => observeScrollSections(SECTIONS.map(([id]) => id), setActive), []);
  return (
    <Grid className="DocsBreadcrumbs" style={{ paddingBottom: 15 }}>
      <div>
        <span>О Компании</span>
        <ul>
          {SECTIONS.map(([id, label]) => (
            <li key={id}>
              <ScrollLink to={id} className={active === id ? 'active' : undefined} smooth={true} offset={-65}>
                {label}
              </ScrollLink>
            </li>
          ))}
        </ul>
      </div>
    </Grid>
  );
}

const Placeholder = () => (
  <div style={{ padding: 16, fontFamily: 'Roboto, sans-serif' }}>
    FSD stories area. Add new stories in `stories/shared|entities|features|widgets|pages|app`.
  </div>
);

export default {
  title: 'FSD/Placeholder',
  component: Placeholder,
  parameters: {
    docs: {
      description: {
        component: 'Temporary placeholder to keep FSD story paths active.',
      },
    },
  },
};

export const Empty = {};

export const state = () => ({
  testimonials: [
    {
      text:
        'It really saves me time and effort. web design is exactly what our business has been lacking. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem risus tristique posuere.',
      author: 'Walter Ward',
    },
    {
      text:
        'It really saves me time and effort. web design is exactly what our business has been lacking. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem risus tristique posuere.',
      author: 'Alex Grace',
    },
    {
      text:
        'It really saves me time and effort. web design is exactly what our business has been lacking. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem risus tristique posuere.',
      author: 'Percy Jackson',
    },
  ],
})

export const getters = {
  allTestimonialsGetter: (state) => {
    return state.testimonials
  },
}

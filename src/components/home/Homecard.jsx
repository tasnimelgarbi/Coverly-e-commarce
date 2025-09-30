import React from 'react'

const Homecard = () => {
  const cards = [
    {
      img: "https://cdn-icons-png.flaticon.com/512/3985/3985848.png", 
      text: "Printing takes 1 to 1.5 weeks"
    },
    {
      img: "https://cdn-icons-png.flaticon.com/512/3231/3231977.png", 
      text: "Shipping all over Egypt"
    },
    {
      img: "https://cdn-icons-png.flaticon.com/512/7417/7417971.png", 
      text: "Best Mobile Cases in Egypt"
    }
  ];

  return (
  <div className='mb-20 px-4'>
  <div className="flex flex-col sm:flex-row gap-6 justify-center mt-2">
    {cards.map((card, index) => (
      <div 
        key={index} 
        tabIndex={0} // مهم عشان يكون focusable على الموبايل/كيبورد
        className="backdrop-blur-md rounded-2xl shadow-lg p-6 flex flex-col items-center gap-4
          hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]
          focus:scale-105 focus:shadow-[0_0_25px_rgba(255,255,255,0.5)]
          focus:outline-none
          transition-transform duration-500 ease-in-out w-9/12 sm:w-[calc(33%-1rem)] mx-auto cursor-pointer">
        <img 
          src={card.img} 
          alt={`Logo ${index+1}`} 
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28"  
        />
        <p className="text-white text-center font-semibold text-sm sm:text-base md:text-lg">
          {card.text}
        </p>
      </div>
    ))}
  </div>
</div>

  )
}

export default Homecard

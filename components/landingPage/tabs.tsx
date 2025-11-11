export default function Tabs() {
  return (
    <div className="w-full h-fit flex flex-col md:flex-row justify-start gap-[30px] items-center rounded-[10px] border py-3 px-4.5">
      <div className="flex justify-center items-center w-[50px] h-[50px] rounded-full bg-[#FFEAF4]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
        >
          <path
            d="M10.1109 2.33325C7.77758 2.33325 7 4.17425 7 6.44575C7 10.5583 11.55 14.2974 14 15.1666C16.45 14.2974 21 10.5583 21 6.44575C21 4.17425 20.0153 2.33325 17.8891 2.33325C16.5865 2.33325 14.6965 4.12817 14 5.18517C13.3035 4.12817 11.4135 2.33325 10.1109 2.33325Z"
            fill="#B32053"
            stroke="#B32053"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M14 15.1665C12.8333 15.8023 11.0833 17.2082 11.0833 19.2498C11.0833 21.2915 16.9167 20.7082 16.9167 22.7498C16.9167 24.7915 10.5 25.6665 10.5 25.6665"
            stroke="#B32053"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div className="w-full md:w-[calc(100%-80px)] text-center md:text-start h-fit flex justify-start items-start flex-col gap-1">
        <h3 className="text-[18px] font-semibold w-full md:w-fit text-center md:text-start">
          Verified Experiences
        </h3>
        <h4 className="text-[18px] font-[500] text-[rgba(0,0,0,0.50)] leading-tight">
          All tours and activities are checked and rated by real travelers.
        </h4>
      </div>
    </div>
  );
}

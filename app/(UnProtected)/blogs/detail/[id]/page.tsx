"use client";
import { BlogsCardType } from "@/lib/types/blog";
import axios from "axios";
import { ChevronLeft } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function app() {
  const { id } = useParams();
  const [item, setItem] = useState<BlogsCardType | null>(null);
  const [loading, setLoading] = useState(true);
  console.log("item-----", item);

  const [refreshData, setRefreshData] = useState(0);
  const router = useRouter();
  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const res = await axios.get(`/api/blogs/${id}`);
        setItem(res.data);
      } catch (error) {
        console.error("Error fetching opportunity:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOpportunity();
  }, [id, refreshData]);

  if (!item) {
    return;
  }

  return (
    <div className="w-full mx-auto space-y-8">
      <div
        className="w-full flex justify-start items-center gap-2 cursor-pointer pt-8"
        onClick={() => {
          router.back();
        }}
      >
        <ChevronLeft size={30} />
        <span className="text-[22px] font-[600]">Blog Details</span>
      </div>
      <div className="w-full max-w-[800px] mx-auto pb-4">
        <section className="w-full mt-[30px] lg:mt-[50px] h-fit space-y-4">
          <div className="w-full h-fit flex flex-col justify-start items-start gap-2 md:gap-[24px]">
            <h1 className="font-[600] text-[20px] md:text-[36px] md:leading-[40px]">
              {item?.title}
            </h1>
            <div className="flex justify-start items-center gap-5">
              {/* <div className="flex justify-start items-center gap-3">
                <Image
                  width={36}
                  height={36}
                  alt=""
                  src={
                    "/blogs imgs/source/ben-den-engelsen-7TU5JJAwPyU-unsplash1.jpg"
                  }
                  className="w-[25px] h-[25px] md:w-[36px] md:h-[36px] rounded-full overflow-hidden object-cover"
                />
                <h3 className="text-[12px] md:text-[16px] text-[#97989F] font-[500]">
                  Tracey Wilson
                </h3>
              </div> */}
              <h4 className="text-[12px] md:text-[16px] text-[#97989F] font-[400]">
                Published on: {moment(item?.createdAt).format("MMM DD, YYYY")}
              </h4>
            </div>
          </div>
          <div className="mx-auto relative flex justify-start items-center h-fit">
            <Image
              width={100}
              height={600}
              alt=""
              src={item?.coverImage}
              className="w-full h-auto md:h-[465px] rounded-[12px] overflow-hidden object-cover"
            />
          </div>
        </section>
        {/* <div className="w-full py-6 md:py-[32px] flex flex-col justify-start items-start gap-6 md:gap-8 font-[400] text-base md:text-[20px] leading-normal md:leading-[32px] text-[#3B3C4A] text-justify md:text-left">
          <p>
            Cappadocia is a destination like no other — a surreal landscape of
            fairy chimneys, ancient cave dwellings, and vibrant culture that
            feels almost otherworldly. Nestled in the heart of Turkey, this
            region offers a perfect blend of natural beauty, rich history, and
            unforgettable experiences for every kind of traveler.
            <br /> One of the most magical ways to experience Cappadocia is by
            taking a sunrise hot air balloon ride. As the sun peeks over the
            horizon, hundreds of colorful balloons fill the sky, illuminating
            the unique rock formations below — a sight that truly captures the
            spirit of this enchanting place. <br />
            Beyond its breathtaking scenery, Cappadocia invites you to dive deep
            into its cultural tapestry. Explore the ancient cave churches of
            Göreme, wander through the underground cities of Derinkuyu and
            Kaymaklı, and discover the artistry of local pottery in Avanos.
            Don’t forget to savor traditional Anatolian dishes like testi kebab
            (a slow-cooked meat stew served in a clay pot) and gözleme (a savory
            stuffed flatbread). <br />
            Engaging with locals adds another layer to your journey — their
            warmth and hospitality make every encounter memorable. A few Turkish
            phrases like “Merhaba” (hello) or “Teşekkür ederim” (thank you) can
            go a long way in showing appreciation and connecting on a more
            personal level.
            <br />
            Whether you're seeking adventure, history, or a peaceful escape,
            Cappadocia promises an experience that stays with you long after you
            leave — a true journey through time, culture, and natural wonder.
          </p>
          <h3 className="text-[24px] font-[600]">Research Your Destination</h3>
          <p>
            Before setting off for Cappadocia, take the time to learn about this
            fascinating region and what makes it so unique. Understanding its
            history, geography, and local traditions will enrich your travel
            experience and help you appreciate the beauty that lies beyond the
            stunning landscapes. Research the best times to visit — especially
            if you plan to experience the iconic hot air balloon rides — and
            make note of key attractions like the Göreme Open-Air Museum,
            Uçhisar Castle, and the underground cities.
            <br /> Familiarize yourself with local customs and etiquette;
            Cappadocians are known for their hospitality, and showing respect
            for their culture goes a long way. Whether it’s learning a few
            Turkish phrases, dressing modestly when visiting religious sites, or
            understanding tipping practices, a little preparation ensures a
            smoother and more meaningful journey. From sampling traditional
            Anatolian cuisine to exploring cave hotels carved into volcanic
            rock, doing your homework ahead of time helps you make the most of
            your stay and uncover the true spirit of Cappadocia.
          </p>
          <h3 className="text-[24px] font-[600]">Plan Your Itinerary</h3>
          <p>
            Cappadocia is filled with breathtaking sights and unique
            experiences, so having a well-thought-out itinerary will help you
            make the most of your visit. While it’s important to leave space for
            spontaneous exploration, a rough plan ensures you don’t miss the
            region’s highlights. Start by prioritizing must-see attractions such
            as the Göreme Open-Air Museum, the fairy chimneys of Pasabag, and
            the underground cities of Derinkuyu or Kaymaklı. <br /> Consider
            dedicating one morning to a hot air balloon ride — the most iconic
            experience in Cappadocia — and another day for hiking through the
            scenic valleys like Ihlara or Love Valley. If you’re interested in
            culture, include stops in Avanos for pottery-making and in Ürgüp for
            wine tasting. <br />
            Allow time to unwind at a cave hotel and soak in the region’s
            tranquil atmosphere. A balanced itinerary will let you experience
            both adventure and relaxation, ensuring your trip to Cappadocia is
            as magical as its landscapes.
          </p>
          <div className="p-8 bg-[#F6F6F7] rounded-[12px] border-l-[4px] border-[#E8E8EA]">
            <span className="text-base md:text-[24px] italic font-normal leading-normal md:leading-[32px]">
              “ Traveling can expose you to new environments and potential
              health risks, so it's crucial to take precautions to stay safe and
              healthy. ”
            </span>
          </div>
          <Image
            width={100}
            height={600}
            alt=""
            src={
              "/blogs imgs/source/0f03870af943da8d5ccab1d4966d4c629d2c1895.jpg"
            }
            className="w-full h-auto md:h-[465px] rounded-[12px] overflow-hidden object-cover"
          />
          <h3 className="text-[24px] font-[600]">Pack Lightly and Smartly</h3>
          <p>
            Packing for Cappadocia requires a bit of strategy, as the region’s
            weather can vary greatly between day and night. Start by making a
            checklist of essentials and focus on versatile clothing that you can
            layer — mornings can be cool, especially if you’re taking a sunrise
            balloon ride, while afternoons tend to be warm and sunny.
            Comfortable walking shoes are a must for exploring the rocky valleys
            and ancient cave sites. <br /> Opt for breathable fabrics during the
            summer months and don’t forget a light jacket or scarf for cooler
            evenings. If you’re visiting in winter, bring warm layers, gloves,
            and a hat — Cappadocia can get surprisingly chilly. A hat,
            sunglasses, and sunscreen are year-round essentials to protect
            yourself from the sun.
            <br /> Keep your luggage light and organized with packing cubes or
            compression bags, and leave a little space for souvenirs like
            handmade pottery or local crafts. Packing smartly ensures you’re
            comfortable, prepared, and ready to fully enjoy Cappadocia’s
            stunning landscapes and adventures.
          </p>
          <h3 className="text-[24px] font-[600]">Stay Safe and Healthy</h3>
          <p>
            Cappadocia is a welcoming and generally safe destination, but taking
            a few precautions will help you enjoy your trip with peace of mind.
            Start by checking any travel advisories or health recommendations
            before your visit, and make sure you have basic travel insurance
            that covers outdoor activities like hot air ballooning or hiking.
            <br />
            The region’s dry climate and high altitude mean it’s easy to get
            dehydrated, so carry a refillable water bottle and drink plenty of
            fluids throughout the day. Sunscreen, sunglasses, and a hat are
            essential for protecting yourself from the strong Anatolian sun,
            especially during outdoor excursions. If you plan to hike or explore
            valleys, wear sturdy shoes and watch your footing on uneven terrain.
            <br />
            Cappadocia is known for its friendly locals and low crime rate, but
            it’s still wise to keep your valuables secure and be mindful of your
            surroundings in busy areas. With a bit of preparation and awareness,
            you can focus on what truly matters — soaking in the breathtaking
            scenery and creating unforgettable memories.
          </p>
          <h3 className="text-[24px] font-[600]">Capture Memories</h3>
          <p>
            Cappadocia is one of those places that feels like a dream — and
            you’ll want to remember every breathtaking moment. Be sure to
            capture the magic through photos, whether it’s the colorful balloons
            floating over Göreme at sunrise, the intricate details of cave
            churches, or the golden glow of the valleys at sunset. A travel
            journal can also be a wonderful way to record your impressions,
            favorite meals, and the people you meet along the way.
            <br />
            Don’t forget to pick up meaningful souvenirs, such as hand-painted
            ceramics from Avanos or locally made evil eye charms, to bring a
            piece of Cappadocia home with you.
            <br />
            While it’s tempting to photograph everything, remember to put your
            camera down once in a while and simply take in the view. The true
            beauty of Cappadocia lies not just in its landscapes, but in the
            feelings it evokes — awe, peace, and a deep connection to a place
            unlike anywhere else on earth.
          </p>
          <h3 className="text-[24px] font-[600]">Conclusion:</h3>
          <p>
            Cappadocia is more than just a destination — it’s an experience that
            blends history, adventure, and wonder in perfect harmony. With a bit
            of planning, an open heart, and a spirit of curiosity, you can
            uncover the magic that makes this region truly unforgettable. From
            drifting over fairy chimneys in a hot air balloon to exploring
            ancient cave dwellings and savoring authentic Turkish flavors, every
            moment offers something extraordinary.
            <br />
            So pack your sense of adventure, embrace the unexpected, and let
            Cappadocia’s timeless beauty leave an imprint on your soul. This is
            not just a journey — it’s a story you’ll carry with you forever.
          </p>
        </div> */}
        <div className="w-full py-6 md:py-[32px] flex flex-col justify-start items-start gap-6 md:gap-8 font-[400] text-base md:text-[20px] leading-normal md:leading-[32px] text-[#3B3C4A] text-justify md:text-left">
          <div
            className="content w-[100%] flex flex-col gap-1 md:gap-2"
            style={{ textAlign: "start" }}
            dangerouslySetInnerHTML={{ __html: item?.text }}
          />
        </div>
      </div>
    </div>
  );
}

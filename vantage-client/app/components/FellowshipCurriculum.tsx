import Image from 'next/image';
import Link from 'next/link';

const AugmentSection = () => {
  return (
    <div 
      id="why-augment-1" 
      className="flex flex-col lg:flex-row lg:odd:flex-row-reverse lg:items-stretch gap-6 lg:gap-20 items-center py-[35px] lg:py-[50px]"
    >
      {/* Image Section */}
      <div className="w-full lg:max-w-[calc(50%-2.5rem)] lg:flex-1 lg:aspect-square">
        <div className="aspect-square overflow-hidden">
          <figure className="relative h-full w-full">
            <Image
              alt="Real-world startup insights illustration"
              src="/assets/classroom.jpg"
              fill
              className="object-cover rounded-2xl"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </figure>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-10 w-full lg:max-w-[calc(50%-2.5rem)] lg:flex-1 lg:px-20 lg:py-10">
        {/* Navigation Dots */}
        <ul className="flex gap-2 lg:gap-3">
          <li>
            <div className="flex items-center justify-center text-sm text-center tracking-normal leading-none w-7 h-7 rounded-full transition-all border bg-neon border-black/20 text-black">
              1
            </div>
          </li>
          <li>
            <Link 
              href="#why-augment-2" 
              className="flex items-center justify-center text-sm text-center tracking-normal leading-none w-7 h-7 rounded-full transition-all border border-charcoal/10 text-charcoal/60 hover:bg-charcoal/5"
            >
              2
            </Link>
          </li>
          <li>
            <Link 
              href="#why-augment-3" 
              className="flex items-center justify-center text-sm text-center tracking-normal leading-none w-7 h-7 rounded-full transition-all border border-charcoal/10 text-charcoal/60 hover:bg-charcoal/5"
            >
              3
            </Link>
          </li>
        </ul>

        {/* Main Content */}
        <div className="lg:flex lg:flex-col lg:justify-center lg:flex-1">
          <div className="text-sm font-semibold uppercase tracking-wider opacity-70 mb-4">
            Why Augment?
          </div>
          <h3 className="text-[1.625rem] font-bold text-charcoal lg:text-3xl mb-5 lg:mb-6 font-section-heading">
            Real-World Startup Insights
          </h3>
          <div className="text-base leading-relaxed">
            <p>
              Gain hands-on experience and actionable skills. Augment provides real-world tactics and frameworks, taught by business legends.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <Link 
          href="/augment-mba-program" 
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-black bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors self-center lg:self-start"
        >
          Explore Courses
        </Link>
      </div>
    </div>
  );
};

export default AugmentSection;
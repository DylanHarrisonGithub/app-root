import React, { useEffect } from "react";
import { Link } from 'react-router-dom';

export type CarouselProps = {
  categoryName?: string,
  disableBrowseAll?: boolean,
  initScrollToItem?: number,
  onScrollLeftEnd?: () => any,
  onScrollRightEnd?: () => any,
  onScroll?: (item: number) => any,
  children: React.ReactNode[]
}

const useIsOverflow = (ref: React.RefObject<any>, callback?: (hasOverflow: boolean) => any) => {
  const [isOverflow, setIsOverflow] = React.useState<boolean | undefined>(undefined);

  React.useLayoutEffect(() => {
    const { current } = ref;

    const trigger = () => {
      const hasOverflow = current.scrollWidth > current.clientWidth;

      setIsOverflow(hasOverflow);

      if (callback) callback(hasOverflow);
    };

    if (current) {
      trigger();
    }
  }, [callback, ref]);

  return isOverflow;
};

const Carousel: React.FC<CarouselProps> = (props: CarouselProps) => {

  const ref = React.useRef<HTMLDivElement>(null);
  //const isOverflow = useIsOverflow(ref);
  const [isOverflow, setIsOverflow] = React.useState<boolean>(false);

  //const [scroll, setScroll] = React.useState<number>(0);
  useEffect(() => {
    const checkOverflow = () => setIsOverflow(ref.current!! && (ref.current.scrollWidth > ref.current.clientWidth));
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [])

  useEffect(() => {
    if (props.initScrollToItem) {
      ref.current!.scrollLeft += props.initScrollToItem*(ref.current!.scrollWidth/props.children.length);
    }
    ref?.current && setIsOverflow(ref.current.scrollWidth > ref.current.clientWidth) 
  }, [props.children])

  return (
    <div className="relative">
      {
        (props.categoryName && props.categoryName.length) &&
          <h2 className="inline-block text-black">{props.categoryName}</h2>
      }
      {
        (!props.disableBrowseAll && props.categoryName) &&
        <h2 className="inline-block float-right mr-1">
          <Link to={"/"+props.categoryName!.replaceAll(' ', '')} className="link link-primary">Browse All</Link>
        </h2>
      }

      
      <div className="carousel carousel-center rounded-box" ref={ref}>
        {
          props.children.map((node, i) => (
            <div className="carousel-item m-2" key={i}>
              { node }
            </div>
          ))
        }
      </div>

      {
        isOverflow && 
        <div className="absolute z-10 left-0 -translate-x-1/2 top-1/2 -translate-y-1/2">
          <a 
            className=" btn btn-circle text-4xl  p-8 glass cursor-pointer" 
            // href={'#'+props.categoryName.replaceAll(' ', '')+((scroll + props.children.length-1) % props.children.length)}
            // onClick={() => setScroll(s => (s + props.children.length-1) % props.children.length)}
            onClick={()=>{ 
              props.onScroll && props.onScroll(Math.round(props.children.length*ref.current!.scrollLeft/ref.current!.scrollWidth));
              ref.current!.scrollLeft -= (1.0/props.children.length)*ref.current!.scrollWidth;

              if (ref.current!.scrollLeft <= 0) {
                props.onScrollLeftEnd && props.onScrollLeftEnd();
              }
            }}
          >
            <span className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-black">❮</span>
          </a>
        </div>

      }

      {
        isOverflow &&
          <div className="absolute z-10 right-0 top-1/2 translate-x-1/2 -translate-y-1/2">
            <a 
              className="btn btn-circle text-4xl  p-8 glass cursor-pointer"
              // href={'#'+props.categoryName.replaceAll(' ', '')+((scroll + 1) % props.children.length)}
              onClick={()=>{
                props.onScroll && props.onScroll(Math.round(props.children.length*ref.current!.scrollLeft/ref.current!.scrollWidth) + 2);
                ref.current!.scrollLeft += (1.0/props.children.length)*ref.current!.scrollWidth;
                if (ref.current!.scrollLeft >= (ref.current!.scrollWidth - ref.current!.clientWidth)) {
                  props.onScrollRightEnd && props.onScrollRightEnd();
                }
              }}
              // onClick={()=>{ 
              //   ref.current!.scrollLeft += .6*ref.current!.clientWidth;
              //   // if (ref.current!.scrollLeft >= (ref.current!.clientWidth - .6*ref.current!.clientWidth)) {
              //   //   alert('scrolled max left')
              //   // }
              // }}
            >
              <span className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-black">❯</span>
            </a>

          </div>

      }

    </div>
  )
}

export default Carousel;
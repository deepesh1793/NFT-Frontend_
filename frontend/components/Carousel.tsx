import React, { useState, FC, ReactNode, useEffect } from 'react';
import ContentBox from './ContentBox'; // Assuming ContentBox is another React component

interface Content {
  value: string;
  contentType: string;
}

interface Props {
  content: Content[];
  current: number;
  children?: ReactNode;
}

const ContentNavigator: FC<Props> = ({ content, current, children }) => {
  const [currentElement, setCurrentElement] = useState(content[current]);

  useEffect(() => {
    setCurrentElement(content[current]);
  }, [current, content]);

  return (
    <div className="box">
      <ContentBox src={currentElement.value} contentType={currentElement.contentType}>
        {React.Children.map(children, (child) => 
          React.cloneElement(child as React.ReactElement<any>, {
            contentType: currentElement.contentType,
            src: currentElement.value,
            current,
          })
        )}
      </ContentBox>
      {content.length > 1 && (
        <>
          {current > 0 && (
            <a className="left ui button" href={`#${current - 1}`}>
              &lt;
            </a>
          )}
          {current < content.length - 1 && (
            <a className="right ui button" href={`#${current + 1}`}>
              &gt;
            </a>
          )}
        </>
      )}
      <style jsx>{`
        .left, .right {
          font-size: 5em;
          opacity: 40%;
          position: absolute;
          top: 33%;
          height: 33%;
          user-select: none;
        }
        .left {
          left: 0;
        }
        .right {
          right: 0;
        }
        .box {
          position: relative;
        }
      `}</style>
    </div>
  );
};

export default ContentNavigator;

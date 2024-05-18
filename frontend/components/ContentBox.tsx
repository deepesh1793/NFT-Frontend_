import React from 'react';

interface Props {
    src: string;
    contentType?: string;
}

const MediaViewer: React.FC<Props> = ({ src, contentType = "application/octet-stream" }) => {
    const fallback = !contentType.startsWith('image') &&
        !contentType.startsWith('video') &&
        !contentType.startsWith('audio');

    return (
        <div className={fallback ? "fallback" : ""}>
            {contentType.startsWith('image') && <img src={src} alt="NFT content page" />}
            {contentType.startsWith('video') && <video src={src} />}
            {contentType.startsWith('audio') && <audio src={src} />}
            {!contentType.startsWith('image') &&
                !contentType.startsWith('video') &&
                !contentType.startsWith('audio') && (
                    <slot>
                        {/* <span className="filler">📝</span> */}
                        <img id="default_img" src="/images/background.png" alt="background" />
                    </slot>
                )}
        </div>
    );
};

export default MediaViewer;

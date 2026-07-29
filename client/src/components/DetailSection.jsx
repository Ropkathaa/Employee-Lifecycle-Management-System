export default function DetailSection({ title, data }) {

    return (

        <div className="detail-section">

            {typeof data !== "string" && <h3>{title}</h3>}

            {
                typeof data === "string"
                    ? (
                        <div className="xai-box">
                            {data.split("\n").map((line, index) => (
                                <p key={index}>{line}</p>
                            ))}
                        </div>
                    )
                    : (
                        <pre>
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    )
            }

        </div>

    );

}
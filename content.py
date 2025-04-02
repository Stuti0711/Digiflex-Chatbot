# content.py

def get_response_format(query_type):
    """
    Defines AI response formatting using HTML for better visual appeal.
    """

    response_templates = {
        "default": "<p>{response}</p>",  # Standard paragraph format
        "paragraph": "<div style='font-size: 16px; line-height: 1.6;'><strong>📝 Detailed Explanation:</strong><br><br>{response}</div>",
        "bullet_points": (
            "<div style='font-size: 16px; line-height: 1.6;'>"
            "<strong>🔹 Key Points:</strong><br><ul>"
            + "".join([f"<li>{point.strip()}</li>" for point in "{response}".split("\n") if point.strip()])
            + "</ul></div>"
        ).replace("{response}", "{response}"),  # Fix incorrect replacement
        "points_with_paragraph": (
            "<div style='font-size: 16px; line-height: 1.6;'>"
            "<strong>📝 Overview:</strong><br><br>{paragraph}<br><br>"
            "<strong>🔹 Key Takeaways:</strong><br><ul>"
            + "".join([f"<li>{point.strip()}</li>" for point in "{points}".split("\n") if point.strip()])
            + "</ul></div>"
        ).replace("{paragraph}", "{response}").replace("{points}", "{response}"),
        "bold": "<strong>{response}</strong>",
        "italic": "<em>{response}</em>",
        "underline": "<u>{response}</u>",
    }

    return response_templates.get(query_type, response_templates["default"])
import requests
from bs4 import BeautifulSoup

# Replace with your ScrapingDog API key
API_KEY = "6756ccbc44439acad0b145d0"

def scrape_with_scrapingdog(topic):
    # ScrapingDog API URL
    url = f"https://api.scrapingdog.com/scrape?api_key={API_KEY}&url=https://en.wikipedia.org/wiki/{topic}"
    
    try:
        # Make the request
        response = requests.get(url)
        
        if response.status_code == 200:
            # Parse the HTML content
            soup = BeautifulSoup(response.text, 'html.parser')
            # Extract paragraphs (or any other data you need)
            paragraphs = soup.find_all('p')
            extracted_text = "\n".join([para.text for para in paragraphs[:5]])  # First 5 paragraphs
            return extracted_text
        else:
            return f"Error: Received status code {response.status_code}"
    
    except Exception as e:
        return f"An error occurred: {str(e)}"

# Example usage
topic = "Allu_Arjun"
result = scrape_with_scrapingdog(topic)
print(result)

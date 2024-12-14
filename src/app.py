import json
from urllib.request import urlopen
from recipe_scrapers import scrape_html


def lambda_handler(event, context):
    body = json.loads(event['body'])
    url = body['url']
    html = urlopen(url).read().decode("utf-8") 
    scraper = scrape_html(html, org_url=url)
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST'
        },
        'body': json.dumps(scraper.to_json())
    }
    
    

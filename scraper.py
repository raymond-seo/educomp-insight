import requests
from bs4 import BeautifulSoup
from supabase import create_client

# 설정 정보
URL = "https://ocrsmxhyzfeqbywofbjj.supabase.co"
KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jcnNteGh5emZlcWJ5d29mYmpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MDQ3MDUsImV4cCI6MjA5MDA4MDcwNX0.EzAo1PmzKHMcs7gq8KhgHD7AYK7ZdNOi0tJEZffnVGU"
supabase = create_client(URL, KEY)

def fetch_and_save_intel(competitor_id, comp_name, target_url):
    print(f"🔍 [{comp_name}] 감시 시작: {target_url}")
    
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        res = requests.get(target_url, headers=headers, timeout=10)
        soup = BeautifulSoup(res.text, 'html.parser')
        
        # 사이트마다 구조가 다르므로, 가장 흔한 'article'이나 'h2', 'h3'를 탐색합니다.
        # 더 정확한 수집을 원하시면 사이트별로 selector를 다르게 설정할 수 있습니다.
        articles = soup.select('article') or soup.select('.post') or soup.select('.news-item')
        
        if not articles:
            print(f"⚠️ [{comp_name}] 뉴스 항목을 찾을 수 없습니다. HTML 구조를 확인해보세요.")
            return

        for art in articles[:3]: # 최신글 3개씩만
            title_tag = art.find(['h2', 'h3', 'h4'])
            link_tag = art.find('a')
            
            if not title_tag or not link_tag: continue
            
            title = title_tag.text.strip()
            link = link_tag['href']
            if not link.startswith('http'): # 상대 경로일 경우 절대 경로로 수정
                from urllib.parse import urljoin
                link = urljoin(target_url, link)
            
            # 슈파베이스에 저장
            data = {
                "competitor_id": competitor_id,
                "title": f"[AI 자동] {title}",
                "content": f"{comp_name}의 새로운 소식이 포착되었습니다.",
                "source_url": link,
                "category": "Market Trends",
                "priority": "Medium"
            }
            
            try:
                supabase.table("intelligence").insert(data).execute()
                print(f"   ✅ 신규 등록: {title}")
            except:
                print(f"   ⏩ 중복 스킵: {title}")
                
    except Exception as e:
        print(f"   ❌ 에러 발생 ({comp_name}): {e}")

def run_all_scrapers():
    # 2. DB에서 news_url이 등록된 모든 경쟁사 목록을 가져옵니다.
    print("🚀 전체 경쟁사 리스트 불러오는 중...")
    response = supabase.table("competitors").select("id, name, news_url").execute()
    competitors = response.data

    if not competitors:
        print("등록된 경쟁사가 없습니다.")
        return

    # 3. 모든 경쟁사를 한 바퀴 돌면서 수집합니다.
    for comp in competitors:
        if comp.get('news_url'):
            fetch_and_save_intel(comp['id'], comp['name'], comp['news_url'])
        else:
            print(f"⏩ {comp['name']}은(는) news_url이 등록되지 않아 건너뜁니다.")

if __name__ == "__main__":
    run_all_scrapers()
import re

path = r"d:\Eduooz\live\Eduooz-website\courses\mlt\kerala\jla-lab-technician.html"
with open(path, encoding="utf-8") as f:
    html = f.read()

void_tags = {"area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"}

def strip_blocks(html, tagname):
    pattern = re.compile(r"<%s\b[^>]*>.*?</%s>" % (tagname, tagname), re.DOTALL | re.IGNORECASE)
    return pattern.sub(lambda m: "<%s></%s>" % (tagname, tagname), html)

clean = strip_blocks(html, "script")
clean = strip_blocks(html, "style")

tag_re = re.compile(r"<(/?)([a-zA-Z0-9]+)([^>]*?)(/?)>")
stack = []
errors = []
line_no = 1
last_idx = 0

for m in tag_re.finditer(clean):
    seg = clean[last_idx:m.start()]
    line_no += seg.count("\n")
    last_idx = m.start()
    closing, tag, attrs, selfclose = m.group(1), m.group(2).lower(), m.group(3), m.group(4)
    if tag in void_tags or selfclose == "/":
        continue
    if closing == "/":
        if not stack:
            errors.append(f"Extra closing </{tag}> at line {line_no}")
            continue
        if stack[-1][0] != tag:
            errors.append(f"Mismatch at line {line_no}: expected </{stack[-1][0]}> (opened line {stack[-1][1]}) got </{tag}>")
            found = None
            for i in range(len(stack)-1, -1, -1):
                if stack[i][0] == tag:
                    found = i
                    break
            if found is not None:
                stack[:] = stack[:found]
            else:
                continue
        else:
            stack.pop()
    else:
        stack.append((tag, line_no))

print("Remaining open tags:", len(stack))
for t in stack[:80]:
    print(t)
print("Errors:", len(errors))
for e in errors[:80]:
    print(e)
